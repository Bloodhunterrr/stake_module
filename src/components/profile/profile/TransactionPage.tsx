import { useEffect, useState } from "react";
import {
  useLazyGetAllUsersTicketsQuery,
  useLazyGetTransactionsQuery,
} from "@/services/authApi.ts";
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import Loading from "@/components/shared/v2/loading.tsx";
import DateFilter from "@/components/shared/v2/date-filter";
import { useGetMainQuery } from "@/services/mainApi";
import { Trans } from "@lingui/react/macro";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function TicketPage() {
  const [fetchAllUsersTransactions, { isLoading, isError, isFetching }] =
    useLazyGetTransactionsQuery();
  const [fetchAllUsersTickets] = useLazyGetAllUsersTicketsQuery();

  const [data, setData] = useState<any>();
  const [extraCategories, setExtraCategories] = useState<any[]>([]);

  const [selectedCurrencies, setSelectedCurrencies] = useState("");
  const [category, setCategory] = useState("all");
  const [game, setGame] = useState("");
  const [provider, setProvider] = useState("");

  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [betType, setBetType] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
  const [accordionData, setAccordionData] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
    setDates({ startDate: start, endDate: end });
    setSelectedDateFilter(label);
  };

  const navigate = useNavigate();

  const { data: mainData } = useGetMainQuery();

  useEffect(() => {
    if (!mainData) return;

    const fetchData = async () => {
      let newData: any[] = [];

      if (category === "all") {
        const firstThree = mainData.slice(0, 3);
        const rest = mainData.slice(3);

        const results = await Promise.all(
          firstThree.map((cat: any) => {
            if (String(cat.id) === "1") {
              return fetchAllUsersTickets({
                bet_status: status,
                bet_type: betType,
                wallet_name: selectedCurrencies,
                start_date: format(dates.startDate, "yyyy/MM/dd"),
                end_date: format(dates.endDate, "yyyy/MM/dd"),
              }).unwrap();
            } else {
              return fetchAllUsersTransactions({
                bet_status: status,
                bet_type: betType,
                wallet_name: selectedCurrencies,
                start_date: format(dates.startDate, "yyyy/MM/dd"),
                end_date: format(dates.endDate, "yyyy/MM/dd"),
                category_id: cat.id,
                game_id: game,
                provider_id: provider,
              }).unwrap();
            }
          })
        );

        newData = results.map((res, idx) => ({
          category: firstThree[idx].name,
          data: res,
          id: firstThree[idx].id,
        }));

        setData(newData);
        setExtraCategories(rest);

        setOpenAccordionItems(newData.slice(0, 3).map((d) => String(d.id)));
      } else if (category === "1") {
        const res = await fetchAllUsersTickets({
          bet_status: status,
          bet_type: betType,
          wallet_name: selectedCurrencies,
          start_date: format(dates.startDate, "yyyy/MM/dd"),
          end_date: format(dates.endDate, "yyyy/MM/dd"),
        }).unwrap();

        newData = [{ category: "Sport", data: res, id: "1" }];
        setData(newData);
        setOpenAccordionItems(["1"]);
      } else {
        const res = await fetchAllUsersTransactions({
          bet_status: status,
          bet_type: betType,
          wallet_name: selectedCurrencies,
          start_date: format(dates.startDate, "yyyy/MM/dd"),
          end_date: format(dates.endDate, "yyyy/MM/dd"),
          category_id: category,
          game_id: game,
          provider_id: provider,
        }).unwrap();

        const catName =
          mainData?.find((c: any) => String(c.id) === category)?.name ??
          "Category";

        newData = [{ category: catName, data: res, id: category }];
        setData(newData);
        setOpenAccordionItems([category]);
      }
    };

    fetchData();
  }, [
    selectedCurrencies,
    dates.startDate,
    dates.endDate,
    betType,
    status,
    category,
    mainData,
    provider,
    game,
  ]);

  const handleToggleCategory = async (cat: any) => {
    if (!accordionData[cat.id]) {
      let res;
      if (String(cat.id) === "1") {
        res = await fetchAllUsersTickets({
          bet_status: status,
          bet_type: betType,
          wallet_name: selectedCurrencies,
          start_date: format(dates.startDate, "yyyy/MM/dd"),
          end_date: format(dates.endDate, "yyyy/MM/dd"),
        }).unwrap();
      } else {
        res = await fetchAllUsersTransactions({
          bet_status: status,
          bet_type: betType,
          wallet_name: selectedCurrencies,
          start_date: format(dates.startDate, "yyyy/MM/dd"),
          end_date: format(dates.endDate, "yyyy/MM/dd"),
          category_id: cat.id,
        }).unwrap();
      }

      setAccordionData((prev) => ({ ...prev, [cat.id]: res?.children || [] }));
    }
  };

  const filtersCategory = data?.find((cat: any) => cat.data?.filters);
  const currencyOptions =
    filtersCategory?.data?.filters?.wallets?.map((w: any) => ({
      value: w.slug.toUpperCase(),
      label: w.slug.toUpperCase(),
    })) ?? [];

  const userCategory = data?.find((cat: any) => cat.data?.user);

  if (isError) {
    navigate("/");
  }

  function ReportRow({ item, dates, navigate }: any) {
    if (item.total_stake + item.total_won + item.total_lost === 0) {
      return (
        <div className="text-center flex justify-center items-center text-sm h-[28px]">
          <Trans> No data available</Trans>
        </div>
      );
    }

    return (
      <div
        className="text-sm text-center h-7 items-center border-popover px-1 border-b flex"
        onClick={() => {
          if (item.is_player) {
            navigate(`/account/transactions/user/${item?.id}`);
          } else {
            navigate(
              `/account/reports/${item?.id}?${
                dates.startDate
                  ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&`
                  : ""
              }${
                dates.endDate
                  ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}`
                  : ""
              }`
            );
          }
        }}
      >
        <p className="w-1/3 h-full flex items-center truncate line-clamp-1 justify-start text-start shrink-0">
          {item?.name !== "" ? item.name : "------"} ({item.total_played})
        </p>
        <p className="w-full h-full flex items-center justify-center">
          {item.total_stake}
        </p>
        <p className="w-full h-full flex items-center justify-center">
          {item.total_won}
        </p>
        <p className="w-full h-full flex items-center justify-center">
          {item.total_lost}
        </p>
      </div>
    );
  }

  function ReportTable({ group, dates, navigate, isFetching }: any) {
    return (
      <>
        <div className="text-sm text-center h-7 items-center bg-chart-2 border-accent px-1 flex">
          <p className="w-1/3 flex items-center justify-start text-start shrink-0">
            Username
          </p>
          <p className="w-full flex items-center justify-center">Played</p>
          <p className="w-full flex items-center justify-center">Won</p>
          <p className="w-full flex items-center justify-center">Net Win</p>
        </div>

        <div className="cursor-pointer border-none bg-muted/30 text-accent-foreground">
          {isFetching ? (
            <div className="text-sm animate-pulse text-center h-7 items-center px-1 border-b flex">
              <p className="w-[30%] h-full flex items-center justify-start text-start shrink-0"></p>
              <p className="w-full h-full flex items-center justify-center"></p>
              <p className="w-full h-full flex items-center justify-center"></p>
              <p className="w-full h-full flex items-center justify-center text-center"></p>
            </div>
          ) : group.data?.children?.length ? (
            group.data.children.map((item: any, index: number) => (
              <ReportRow
                key={index}
                item={item}
                dates={dates}
                navigate={navigate}
              />
            ))
          ) : (
            <div className="text-center flex justify-center items-center text-sm h-[28px]">
              No data available
            </div>
          )}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className={"min-h-screen flex flex-col items-center justify-center"}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={"min-h-screen container mx-auto"}>
      <div className={"h-10  flex  border-b border-popover items-center"}>
        <div
          className={
            "w-10 h-full border-r text-muted border-popover flex items-center"
          }
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className={"w-10 "} />
        </div>
        <div
          className={
            "w-full text-muted text-center pr-10 space-x-1 flex justify-center"
          }
        >
          <p>Reports</p>
          <span>-</span>
          <p>{userCategory?.data?.user?.name}</p>
        </div>
      </div>
      <div className={" flex flex-col gap-y-3"}>
        <div
          className={
            "w-full border-b border-b-popover py-2 flex flex-row items-center justify-evenly"
          }
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
              >
                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                {format(dates.startDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-white">
              <Calendar
                className="w-full"
                mode="single"
                selected={dates.startDate}
                onSelect={(date) => {
                  setSelectedDateFilter("");
                  date && setDates((prev) => ({ ...prev, startDate: date }));
                }}
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
              >
                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                {format(dates.endDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-white">
              <Calendar
                className="w-full"
                mode="single"
                selected={dates.endDate}
                onSelect={(date) => {
                  setSelectedDateFilter("");
                  date && setDates((prev) => ({ ...prev, endDate: date }));
                }}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectedCurrencies}
            onValueChange={(value) => {
              setSelectedCurrencies(value);
            }}
          >
            <SelectTrigger
              className={
                "h-8! w-1/4  rounded-none  bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder={"Currency"} />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {currencyOptions?.map((currency: any, index: number) => {
                return (
                  <SelectItem
                    key={index}
                    className={"focus:text-background text-accent rounded-none"}
                    value={currency.label}
                  >
                    {currency.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div
          className={
            "flex flex-row items-center border-b pb-2 border-popover justify-between gap-x-2 px-2"
          }
        >
          {/*bet Type*/}
          <Select
            value={betType}
            onValueChange={(value) => {
              setBetType(value);
            }}
          >
            <SelectTrigger
              className={
                "h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent "
              }
            >
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {filtersCategory?.data?.filters &&
                filtersCategory?.data?.filters?.betType.map(
                  (types: string, index: number) => {
                    return (
                      <SelectItem
                        key={index}
                        className={
                          "focus:text-background text-accent rounded-none capitalize"
                        }
                        value={types}
                      >
                        {types}
                      </SelectItem>
                    );
                  }
                )}
            </SelectContent>
          </Select>

          {/*Status options*/}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
            }}
          >
            <SelectTrigger
              className={
                "h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {filtersCategory?.data?.filters &&
                filtersCategory?.data?.filters?.status.map(
                  (status: any, index: number) => {
                    return (
                      <SelectItem
                        key={index}
                        className={
                          "focus:text-background text-accent rounded-none"
                        }
                        value={status}
                      >
                        {status}
                      </SelectItem>
                    );
                  }
                )}
            </SelectContent>
          </Select>

          {/*Categories*/}
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);

              if (value === "all") {
                setOpenAccordionItems(
                  data?.slice(0, 3).map((d: any) => String(d.id)) || []
                );
              } else {
                setOpenAccordionItems([value]);
              }
            }}
          >
            <SelectTrigger
              className={
                "h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              <SelectItem
                key="All"
                value="all"
                className={"focus:text-background text-accent rounded-none"}
              >
                <Trans>All</Trans>
              </SelectItem>
              {mainData?.map((data, index) => (
                <SelectItem
                  key={index}
                  className={"focus:text-background text-accent rounded-none"}
                  value={String(data.id)}
                >
                  {data.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DateFilter
        className="text-accent text-[12px]"
        selected={selectedDateFilter}
        onSelect={handleDateFilterSelect}
      />

      <div className="flex cursor-pointer flex-col p-3">
        {Array.isArray(data) && data.length > 0 ? (
          category === "all" ? (
            <Accordion
              type="multiple"
              value={openAccordionItems}
              onValueChange={(vals) => setOpenAccordionItems(vals)}
            >
              {data.map((group: any) => (
                <AccordionItem
                  key={group.id}
                  value={String(group.id)}
                  className="border-none py-2"
                >
                  <AccordionTrigger className="font-semibold text-sm py-2 text-left ring-0 focus:ring-0">
                    {group.category}
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <ReportTable
                      group={group}
                      dates={dates}
                      navigate={navigate}
                      isFetching={isFetching}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}

              {extraCategories.map((cat: any) => (
                <AccordionItem
                  key={cat.id}
                  value={String(cat.id)}
                  className="border-none py-2"
                >
                  <AccordionTrigger
                    onClick={() => handleToggleCategory(cat)}
                    className="font-semibold text-sm py-2 text-left ring-0 focus:ring-0"
                  >
                    {cat.name}
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <ReportTable
                      group={{ data: accordionData[cat.id] }}
                      dates={dates}
                      navigate={navigate}
                      isFetching={isFetching}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Games */}
              {filtersCategory?.data?.filters?.games?.length > 0 &&
                filtersCategory.data.filters.games.map((g: any) => (
                  <AccordionItem
                    key={`game-${g.id}`}
                    value={`game-${g.id}`}
                    className="border-none py-2"
                  >
                    <AccordionTrigger
                      className="font-semibold text-sm py-2 text-left ring-0 focus:ring-0"
                      onClick={() => {
                        setGame(String(g.id));
                      }}
                    >
                      {g.name}
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <ReportTable
                        group={{ data: g.children || [] }}
                        dates={dates}
                        navigate={navigate}
                        isFetching={isFetching}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}

              {/* Providers */}
              {filtersCategory?.data?.filters?.providers?.length > 0 &&
                filtersCategory.data.filters.providers.map((p: any) => (
                  <AccordionItem
                    key={`provider-${p.id}`}
                    value={`provider-${p.id}`}
                    className="border-none py-2"
                  >
                    <AccordionTrigger
                      className="font-semibold text-sm py-2 text-left ring-0 focus:ring-0"
                      onClick={() => {
                        setProvider(String(p.id));
                      }}
                    >
                      {p.name}
                    </AccordionTrigger>
                    <AccordionContent className="p-0">
                      <ReportTable
                        group={{ data: p.children || [] }}
                        dates={dates}
                        navigate={navigate}
                        isFetching={isFetching}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          ) : (
            data.map((group: any) => (
              <div key={group.id} className="mb-2">
                <h2 className="font-semibold text-sm pb-2 pt-4">{group.category}</h2>
                <ReportTable
                  group={group}
                  dates={dates}
                  navigate={navigate}
                  isFetching={isFetching}
                />
              </div>
            ))
          )
        ) : (
          <div className="text-center text-sm py-3 text-muted-foreground">
            No categories available
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketPage;
