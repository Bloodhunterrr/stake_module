import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useGetMainQuery } from "@/services/mainApi";
import { Trans, useLingui } from "@lingui/react/macro";
import { Calendar } from "@/components/ui/calendar.tsx";
import DateFilter from "@/components/shared/v2/date-filter";
import {CalendarIcon, TicketCheck, X} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { useLazyGetAllUsersTicketsQuery, useLazyGetTransactionsQuery } from "@/services/authApi.ts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Footer from "@/components/shared/v2/footer.tsx";

interface Category {
    id: number;
    category: string;
    data: any;
}

function TicketPage() {
    const [fetchAllUsersTransactions, { isError, isFetching }] = useLazyGetTransactionsQuery();
    const [fetchAllUsersTickets] = useLazyGetAllUsersTicketsQuery();

    const [data, setData] = useState<Category[]>([]);
    const [accordionData, setAccordionData] = useState<{ [key: string]: {
            children : any
            totals : any
        } }>({});
    const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState("EUR");
    const [category, setCategory] = useState("all");
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
    const [clickedAccordion, setClickedAccordion] = useState('')

    useEffect(() => {
        if (!mainData) return;
        const allCategories = mainData.map((cat) => ({
            id: cat.id,
            category: cat.name,
            data: null,
        }));
        const newArray = [
            ...allCategories.slice(0, 1),
            {
                id: 0,
                category: "All Games",
                data: null,
            },
            ...allCategories.slice(1),
        ];
        setData(newArray);
        // Set "All Games" and "Sport" as default open accordions
        const sportCategoryId = allCategories.find((category) => category.category === "Sport")?.id ?? "1";
        setOpenAccordionItems(["0", String(sportCategoryId)]);
        setCategory("all");
    }, [mainData]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetchAllUsersTransactions({
                    start_date: format(dates.startDate, "dd-MM-yyyy"),
                    end_date: format(dates.endDate, "dd-MM-yyyy"),
                }).unwrap();

                if (res.filters) {
                    setFilters(res.filters);
                }

                if (res.user) {
                    setUser(res.user);
                }

                setAccordionData((prev) => ({ ...prev, ["0"]: res || [] }));
            } catch (error) {
                console.error(t`Failed to fetch transactions:`, error);
            }
        };
        fetchTransactions();
    }, [dates.startDate, dates.endDate, fetchAllUsersTransactions, t]);

    useEffect(() => {
        const fetchSportTickets = async () => {
            try {
                const res = await fetchAllUsersTickets({
                    start_date: format(dates.startDate, "dd-MM-yyyy"),
                    end_date: format(dates.endDate, "dd-MM-yyyy"),
                }).unwrap();
                const sportCategoryId = data.find((category) => category.category === "Sport")?.id ?? "1";
                setAccordionData((prev : any) => ({ ...prev, [sportCategoryId]: res || [] }));
            } catch (error) {
                console.error(t`Failed to fetch Sport tickets:`, error);
            }
        };
        if (data.length > 0) {
            fetchSportTickets();
        }
    }, [data, dates.startDate, dates.endDate, fetchAllUsersTickets]);

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
                    category_id: cat.id !== 0 ? cat.id : "",
                }).unwrap();
            }

            setAccordionData((prev) => ({ ...prev, [cat.id]: res || [] }));
            setOpenAccordionItems([String(cat.id)]);
        };

        fetchSelectedCategoryData();
    }, [category, dates.startDate, dates.endDate, data, fetchAllUsersTickets, fetchAllUsersTransactions]);

    const handleToggleCategory = async (cat: Category) => {
        const isOpen = openAccordionItems.includes(String(cat.id));
        setOpenAccordionItems(isOpen ? [] : [String(cat.id)]);

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
                    category_id: cat.id !== 0 ? cat.id : "",
                }).unwrap();
            }
            setAccordionData((prev) => ({ ...prev, [cat.id]: res || [] }));
        }
    };

    const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
        setDates({ startDate: start, endDate: end });
        setSelectedDateFilter(label);
    };

    if (isError) {
        navigate("/");
        return null;
    }

    function ReportRow({ item, dates, navigate, type, categoryName }: any) {
        const showCommission = categoryName.toLowerCase().includes("sport");
        if (item.total_stake + item.total_won + item.total_lost === 0) {
            return (
                <div className="text-center flex justify-center items-center text-xs h-[28px]">
                    <Trans>No data available</Trans>
                </div>
            );
        }
        return (
            <div className="text-xs text-center h-10 items-center px-1 border-b border-b-[var(--grey-300)] flex"
                onClick={() => {
                    if (type === 1) {
                        if (item.is_player) {
                            navigate(
                                `/account/reports/category/${item?.id}?${
                                    dates.startDate
                                        ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&`
                                        : ""
                                }${
                                    dates.endDate
                                        ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}`
                                        : ""
                                }`
                            );
                        } else {
                            navigate(
                                `/account/reports/category/${item?.id}?${
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
                    } else {
                        if (item.is_player) {
                            navigate(
                                `/account/transactions/user/${item?.id}?${
                                    dates.startDate
                                        ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&`
                                        : ""
                                }${
                                    dates.endDate
                                        ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}`
                                        : ""
                                }${type ? `&category=${type}` : ""}`
                            );
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
                                }${categoryName ? `&category=${type}` : ""}`
                            );
                        }
                    }
                }}>
                <p className={'w-1/3 h-full flex items-center truncate line-clamp-1 justify-center text-start shrink-0'}>
                    <span>{item?.username}</span>
                </p>
                <p className="w-full h-full flex items-center justify-center">{item?.total_stake.toFixed(2)}</p>
                <p className="w-full h-full flex items-center justify-center">{item?.total_won.toFixed(2)}</p>
                {showCommission && (
                    <p className="w-full h-full flex items-center justify-center">{item?.sport_commission?.toFixed(2)}</p>
                )}
                <p className={cn("w-full h-full flex items-center justify-center", {
                        "text-destructive": item?.net_win && String(item?.net_win).includes("-"),
                        "text-chart-2": item?.net_win && !String(item?.net_win).includes("-"),
                    })}>
                    {item?.net_win ? item?.net_win.toFixed(2) : "-"}
                </p>
            </div>
        );
    }

    function ReportTable({ group, dates, navigate, isFetching, type, categoryName }: any) {
        const showCommission = categoryName.toLowerCase().includes("sport");
        return (
            <>
                <div className="text-md font-bold text-center h-10 items-center justify-center bg-[var(--grey-600)] text-[var(--grey-200)] border-accent px-1 flex">
                    <p className={cn("w-1/3 h-full flex items-center justify-center text-start shrink-0")}>
                        <Trans>Username</Trans>
                    </p>
                    <p className="w-full h-full flex items-center justify-center">
                        <Trans>Played</Trans>
                    </p>
                    <p className="w-full h-full flex items-center justify-center">
                        <Trans>Won</Trans>
                    </p>
                    {showCommission && (
                        <p className="w-full h-full flex items-center justify-center">
                            <Trans>Comm</Trans>
                        </p>
                    )}
                    <p className="w-full h-full flex items-center justify-center">
                        <Trans>Net Win</Trans>
                    </p>
                </div>

                <div className="cursor-pointer border-none bg-transparent text-white">
                    {(isFetching && (clickedAccordion === type)) ? (
                        <div className="text-xs text-center h-10 items-center px-1 border-b border-b-[var(--grey-300)] flex">
                            <p className="w-1/3 h-full flex items-center justify-start text-start shrink-0"></p>
                            <p className="w-full h-full flex items-center justify-center"></p>
                            <p className="w-full h-full flex items-center justify-center"></p>
                            <p className="w-full h-full flex items-center justify-center text-center"></p>
                        </div>
                    ) : group.data?.children?.length ? (
                        group.data?.children?.map((item: any, index: number) => {
                            const hasNoData = group.data.children?.every(
                                (item: any) =>
                                    item.total_played + item.total_stake + item.total_won + item.total_lost === 0
                            );
                            if (item.total_played + item.total_stake + item.total_won + item.total_lost !== 0) {
                                return (
                                    <ReportRow
                                        categoryName={categoryName}
                                        type={type}
                                        key={index}
                                        item={item}
                                        dates={dates}
                                        navigate={navigate}/>
                                );
                            } else {
                                if (hasNoData && index === 0) {
                                    return (
                                        <div className="text-center flex justify-center items-center text-xs h-[28px]">
                                            <Trans>No data available</Trans>
                                        </div>
                                    );
                                }
                            }
                        })
                    ) : (
                        <div className="text-center flex justify-center items-center text-xs h-[28px]">
                            <Trans>No data available</Trans>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[var(--grey-600)] flex flex-col justify-between">
            <div className="min-h-max w-[calc(94dvw_-_60px)] max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto flex flex-col items-center py-0">
                <div className={"h-10 w-full flex items-center mt-6"}>
                    <div className={'w-max text-2xl font-bold text-white text-center pr-10 space-x-1 flex gap-1 justify-center mr-auto'}>
                        <TicketCheck className={'ml-1 mt-0.5 size-8 text-[var(--grey-100)]'}/>
                        <p className={"mr-1"}><Trans>Reports</Trans></p>
                        <span>-</span>
                        <p>{user?.name}</p>
                    </div>
                    <div className={'w-10 h-full text-[var(--grey-200)] hover:text-white flex items-center'} onClick={()=>navigate(-1)}>
                        <X className={'w-10'} />
                    </div>
                </div>
                <div className="flex flex-row max-[920px]:flex-col gap-6 w-full my-6">
                    <div className={"sticky max-w-full min-w-[180px] h-max top-[20px] p-3 flex flex-col gap-2 bg-[var(--grey-700)] rounded-[8px] text-[var(--grey-100)]"}>
                        <div className="min-[920px]:w-full flex flex-row min-[920px]:flex-col gap-2 items-center justify-evenly">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline"
                                        className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                        <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                        {format(dates.startDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 bg-white z-[100]">
                                    <Calendar className="w-full" mode="single"
                                        selected={dates.startDate}
                                        onSelect={(date) => {
                                            setSelectedDateFilter("");
                                            if(date) {
                                                setDates((prev : any) => ({ ...prev, startDate: date }));
                                            }
                                        }}/>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline"
                                        className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                        <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                        {format(dates.endDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 bg-white z-[100]">
                                    <Calendar className="w-full" mode="single"
                                        selected={dates.endDate}
                                        onSelect={(date) => {
                                            setSelectedDateFilter("")
                                            if(date){
                                                setDates((prev : any) => ({ ...prev, endDate: date }));
                                            }
                                        }}/>
                                </PopoverContent>
                            </Popover>

                            <Select value={selectedCurrencies} onValueChange={(value) => {
                                    setSelectedCurrencies(value);
                                }}>
                                <SelectTrigger className="h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold">
                                    <SelectValue placeholder={t`Currency`} />
                                </SelectTrigger>
                                <SelectContent className="border-none bg-[var(--grey-900)] rounded-md">
                                    {filters?.wallets?.map((w: any, index: number) => (
                                        <SelectItem key={index} value={w.slug.toUpperCase()}
                                            className="focus:text-background text-accent rounded-sm capitalize">
                                            {w.slug.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-y-2">
                        <DateFilter className="text-accent text-[12px]" selected={selectedDateFilter} onSelect={handleDateFilterSelect}/>
                        <div className="flex cursor-pointer pb-2 flex-col">
                            {Array.isArray(data) && data.length > 0 ? (
                                category === "all" ? (
                                    <Accordion type="multiple" className="space-y-2" value={openAccordionItems}
                                               onValueChange={(vals) => setOpenAccordionItems(vals)}>
                                        {data.map((group : any) => {
                                            const totals = accordionData[group.id]?.totals;
                                            const showCommission = group.category.toLowerCase().includes("sport");
                                            return (
                                                <AccordionItem key={group.id} value={String(group.id)}
                                                               onClick={()=>{
                                                                   setClickedAccordion(group.id)
                                                               }} className="border-t border-t-[var(--grey-300)] border-b-transparent bg-[var(--grey-700)]">
                                                    <AccordionTrigger className="hover:no-underline px-3 h-11 py-0 flex items-center cursor-pointer"
                                                                      onClick={() => handleToggleCategory(group)}>
                                                        {group.category}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="flex cursor-pointer flex-col py-3 px-4 rounded-[8px] border border-[color:var(--grey-400)] bg-[var(--grey-600)] border-solid mx-2 mb-2">
                                                        <ReportTable categoryName={group.category} type={group.id}
                                                                     group={group.data ? group : { data: accordionData[group.id] }}
                                                                     dates={dates} navigate={navigate}
                                                                     isFetching={isFetching}/>
                                                        {/* TOTALS */}
                                                        <div className="text-md w-full bg-[var(--grey-900)] text-white px-1 text-center h-10 items-center border-b border-b-[var(--grey-400)] flex">
                                                            <p className={cn("w-1/3 h-full flex items-center truncate justify-center text-start shrink-0")}>
                                                                <span>Totals</span>
                                                            </p>
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <p className="w-1/2 h-full flex items-center justify-center">
                                                                    {totals?.total_stake?.toFixed(2) ?? "0.00"}
                                                                </p>
                                                            </div>
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <p className="w-1/2 h-full flex items-center justify-center">
                                                                    {totals?.total_won?.toFixed(2) ?? "0.00"}
                                                                </p>
                                                            </div>
                                                            {showCommission && (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <p className="w-1/2 h-full flex items-center justify-center">
                                                                        {totals?.sport_commission?.toFixed(2) ?? "0.00"}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <p className={cn("w-1/2 h-full flex items-center justify-center", {
                                                                    "text-destructive": totals?.net_win && String(totals?.net_win).includes("-"),
                                                                    "text-chart-2": totals?.net_win && !String(totals?.net_win).includes("-"),
                                                                })}>
                                                                    {totals?.net_win ? totals?.net_win.toFixed(2) : "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                ) : (
                                    <Accordion type="single" value={openAccordionItems[0]}
                                               onValueChange={(val) => setOpenAccordionItems(val ? [val] : [])}>
                                        {data.filter((group) => String(group.id) === category)
                                            .map((group) => (
                                                <AccordionItem key={group.id} value={String(group.id)} className="border-none">
                                                    <AccordionTrigger onClick={() => handleToggleCategory(group)}>
                                                        {group.category}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <ReportTable type={group.id} categoryName={group.category}
                                                                     group={group.data ? group : { data: accordionData[group.id] }}
                                                                     dates={dates} navigate={navigate} isFetching={isFetching}/>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                    </Accordion>
                                )
                            ) : (
                                <div className="text-center text-xs py-3 text-muted-foreground">
                                    <Trans>No categories available</Trans>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TicketPage;
