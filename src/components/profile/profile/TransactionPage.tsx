import { useEffect, useRef, useState } from "react";
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
import DateFilter from "@/components/shared/v2/date-filter";
import { useGetMainQuery } from "@/services/mainApi";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Category {
  id: number;
  category: string;
  data: any;
}

function TicketPage() {
  const [fetchAllUsersTransactions, { isError, isFetching }] =
    useLazyGetTransactionsQuery();
  const [fetchAllUsersTickets] = useLazyGetAllUsersTicketsQuery();

  const [data, setData] = useState<Category[]>([]);
  const [accordionData, setAccordionData] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  const [selectedCurrencies, setSelectedCurrencies] = useState("");
  const [category, setCategory] = useState("all");
  const [betType, setBetType] = useState("");
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [filters, setFilters] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

  const navigate = useNavigate();
  const { data: mainData } = useGetMainQuery();
  const { t } = useLingui();

  useEffect(() => {
    if (!mainData) return;

    const allCategories = mainData.map((cat) => ({
      id: cat.id,
      category: cat.name,
      data: null,
    }));

    setData(allCategories);
    setOpenAccordionItems([]);
  }, [mainData]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetchAllUsersTransactions({
          start_date: format(dates.startDate, "dd-MM-yyyy"),
          end_date: format(dates.endDate, "dd-MM-yyyy"),
        }).unwrap();

        console.log(res);

        if (res.filters) {
          setFilters(res.filters);
        }

        if (res.user) {
          setUser(res.user);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!data || category === "all") return;

    const fetchSelectedCategoryData = async () => {
      const cat = data.find((d) => String(d.id) === category);
      if (!cat) return;

      let res;
      if (String(cat.id) === "1") {
        res = await fetchAllUsersTickets({
          start_date: format(dates.startDate, "dd-MM-yyyy"),
          end_date: format(dates.endDate, "dd-MM-yyyy"),
        }).unwrap();
      } else {
        res = await fetchAllUsersTransactions({
          start_date: format(dates.startDate, "dd-MM-yyyy"),
          end_date: format(dates.endDate, "dd-MM-yyyy"),
          category_id: cat.id,
        }).unwrap();
      }

      setAccordionData((prev) => ({ ...prev, [cat.id]: res?.children || [] }));
      setOpenAccordionItems([cat.id.toString()]);
    };

    fetchSelectedCategoryData();
  }, [category, dates.startDate, dates.endDate, data]);

  const prevDatesRef = useRef({
    startDate: dates.startDate,
    endDate: dates.endDate,
  });

  useEffect(() => {
    if (!data || category !== "all" || openAccordionItems.length === 0) return;

    const prevDates = prevDatesRef.current;

    if (
      prevDates.startDate.getTime() === dates.startDate.getTime() &&
      prevDates.endDate.getTime() === dates.endDate.getTime()
    ) {
      return;
    }

    const fetchAllOpenedCategories = async () => {
      const updatedAccordionData: { [key: string]: any[] } = {
        ...accordionData,
      };

      for (const cat of data) {
        if (openAccordionItems.includes(String(cat.id))) {
          let res;
          if (String(cat.id) === "1") {
            res = await fetchAllUsersTickets({
              start_date: format(dates.startDate, "dd-MM-yyyy"),
              end_date: format(dates.endDate, "dd-MM-yyyy"),
            }).unwrap();
          } else {
            res = await fetchAllUsersTransactions({
              start_date: format(dates.startDate, "dd-MM-yyyy"),
              end_date: format(dates.endDate, "dd-MM-yyyy"),
              category_id: cat.id,
            }).unwrap();
          }

          updatedAccordionData[cat.id] = res?.children || [];
        }
      }

      setAccordionData(updatedAccordionData);

      prevDatesRef.current = {
        startDate: dates.startDate,
        endDate: dates.endDate,
      };
    };

    fetchAllOpenedCategories();
  }, [dates.startDate, dates.endDate, category, openAccordionItems, data]);

  const handleToggleCategory = async (cat: Category) => {
    if (!accordionData[cat.id]) {
      let res;
      if (String(cat.id) === "1") {
        res = await fetchAllUsersTickets({
          start_date: format(dates.startDate, "dd-MM-yyyy"),
          end_date: format(dates.endDate, "dd-MM-yyyy"),
        }).unwrap();
      } else {
        res = await fetchAllUsersTransactions({
          start_date: format(dates.startDate, "dd-MM-yyyy"),
          end_date: format(dates.endDate, "dd-MM-yyyy"),
          category_id: cat.id,
        }).unwrap();
      }

      setAccordionData((prev) => ({ ...prev, [cat.id]: res?.children || [] }));
    }
  };

  const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
    setDates({ startDate: start, endDate: end });
    setSelectedDateFilter(label);
  };

  console.log(user);
  if (isError) navigate("/");

  if (isError) {
    navigate("/");
  }

  function ReportRow({ item, dates, navigate }: any) {
    if (item.total_stake + item.total_won + item.total_lost === 0) {
      return (
        <div className="text-center flex justify-center items-center text-sm h-[28px]">
          <Trans>No data available</Trans>
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
                  ? `startDate=${format(dates.startDate, "dd-MM-yyyy")}&`
                  : ""
              }${
                dates.endDate
                  ? `endDate=${format(dates.endDate, "dd-MM-yyyy")}`
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
          {!isFetching && group.data?.children?.length ? (
            group.data.children.map((item: any, index: number) => {
              if (
                item.total_played +
                  item.total_stake +
                  item.total_won +
                  item.total_lost !==
                0
              ) {
                return (
                  <ReportRow
                    key={index}
                    item={item}
                    dates={dates}
                    navigate={navigate}
                  />
                );
              } else {
                if (index === 0) {
                  return (
                    <div className="text-center flex justify-center items-center text-sm h-[28px]">
                      <Trans>No data available</Trans>
                    </div>
                  );
                }
              }
            })
          ) : (
            <div className="text-center flex justify-center items-center text-sm h-[28px]">
              <Trans>No data available</Trans>
            </div>
          )}
        </div>
      </>
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
          <p className={"mr-1"}>
            <Trans>Reports</Trans>
          </p>
          <span>-</span>
          <p>{user?.name}</p>
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
                "h-8! w-1/4 rounded-none bg-transparent hover:bg-transparent placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder={t`Currency`} />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {filters?.wallets?.map((w: any, index: number) => (
                <SelectItem
                  key={index}
                  value={w.slug.toUpperCase()}
                  className={
                    "focus:text-background text-accent rounded-none capitalize"
                  }
                >
                  {w.slug.toUpperCase()}
                </SelectItem>
              ))}
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
                "h-8! w-1/2 rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-accent border-none text-accent "
              }
            >
              <SelectValue placeholder={t`Type`} />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {filters?.betType?.map((type: string, index: number) => (
                <SelectItem
                  key={index}
                  value={type}
                  className={
                    "focus:text-background text-accent rounded-none capitalize"
                  }
                >
                  {type}
                </SelectItem>
              ))}
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
                "h-8! w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder={t`Status`} />
            </SelectTrigger>
            <SelectContent className={"border-none bg-background rounded-none"}>
              {filters?.status?.map((status: string, index: number) => (
                <SelectItem
                  key={index}
                  value={status}
                  className={
                    "focus:text-background text-accent rounded-none capitalize"
                  }
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/*Categories*/}
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);

              if (value === "all") {
                setOpenAccordionItems([]);
              } else {
                setOpenAccordionItems([value]);
              }
            }}
          >
            <SelectTrigger
              className={
                "h-8! w-1/2 rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-accent border-none text-accent"
              }
            >
              <SelectValue placeholder={t`Category`} />
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
              {data.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={String(group.id)}
                  className="border-none"
                >
                  <AccordionTrigger onClick={() => handleToggleCategory(group)}>
                    {group.category}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ReportTable
                      group={
                        group.data ? group : { data: accordionData[group.id] }
                      }
                      dates={dates}
                      navigate={navigate}
                      isFetching={isFetching}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Accordion
              type="single"
              value={openAccordionItems[0]}
              onValueChange={(val) => setOpenAccordionItems(val ? [val] : [])}
            >
              {data
                .filter((group) => String(group.id) === category)
                .map((group) => (
                  <AccordionItem
                    key={group.id}
                    value={String(group.id)}
                    className="border-none"
                  >
                    <AccordionTrigger
                      onClick={() => handleToggleCategory(group)}
                    >
                      {group.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ReportTable
                        group={
                          group.data ? group : { data: accordionData[group.id] }
                        }
                        dates={dates}
                        navigate={navigate}
                        isFetching={isFetching}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )
        ) : (
          <div className="text-center text-sm py-3 text-muted-foreground">
            <Trans>No categories available</Trans>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketPage;
