import {Fragment, useRef, useState, useEffect, useCallback} from 'react';
import {useIsDesktop} from '@/hooks/useIsDesktop';
import type {Game, GameListRequest} from '@/types/game_list';
import {useGetGameListQuery} from '@/services/mainApi';
import GameSlot from '@/components/shared/slot';
import NoDataAvailable from '@/components/shared/no-data-available/NoDataAvailable';


const GAME_LIMIT = 24;

interface GameListRendererProps {
    categoriesIDs?: Array<number>,
    providersIDs?: Array<number>
    categoryId?: number;
    providerId?: number;
    searchQuery?: string;
    order_by?: 'order' | 'name';
    onTotalChange?: (total: number) => void;
    skip?: boolean,
    gameDynamicClass?: string
    showNoData?: boolean
}

const GameListRenderer = ({
                              categoriesIDs,
                              providersIDs,
                              categoryId,
                              providerId,
                              searchQuery,
                              order_by = 'order',
                              onTotalChange,
                              skip = (!searchQuery && !categoryId && !providerId),
                              gameDynamicClass,
                              showNoData = false
                          }: GameListRendererProps) => {

    const isDesktop = useIsDesktop();
    const [gameList, setGameList] = useState<(Game | null)[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const listReq: GameListRequest = {
        category_ids: categoryId ? [categoryId] : (categoriesIDs ? categoriesIDs : []),
        provider_ids: providerId ? [providerId] : (providersIDs ? providersIDs : []),
        offset,
        limit: GAME_LIMIT,
        device: (isDesktop ? 'desktop' : 'mobile') as 'desktop' | 'mobile',
        order_by,
        search: searchQuery || undefined
    };

    const {
        data: gameListData,
        isFetching,
    } = useGetGameListQuery(listReq, {skip});

    const loadBlocked = useRef(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setGameList([]);
        setOffset(0);
        setHasMore(true);
        setInitialLoadDone(false);
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
    }, [categoryId, categoriesIDs?.length, providersIDs?.length, providerId, searchQuery, order_by]);

    useEffect(() => {
        if (!gameListData?.games) return;

        setGameList((prev) => {
            const prevWithoutPlaceholders = prev.filter((g) => g && g.id);
            return [...prevWithoutPlaceholders, ...gameListData.games];
        });

        if (onTotalChange && typeof gameListData.total === 'number') {
            onTotalChange(gameListData.total);
        }

        if (gameListData.games.length < GAME_LIMIT) {
            setHasMore(false);
        }

        setInitialLoadDone(true);
    }, [gameListData, onTotalChange]);

    const loadNext = useCallback(() => {
        if (!isFetching && hasMore && !loadBlocked.current) {
            loadBlocked.current = true;

            setGameList((prev) => [
                ...prev,
                ...Array.from({length: GAME_LIMIT}, () => null as unknown as Game),
            ]);

            setOffset((prev) => prev + GAME_LIMIT);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        if (!isFetching) {
            loadBlocked.current = false;
        }
    }, [isFetching]);

    useEffect(() => {
        if (!initialLoadDone) return;

        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting) {
                loadNext();
            }
        };

        observerRef.current = new IntersectionObserver(observerCallback, {
            root: null,
            threshold: 1.0,
        });

        const sentinel = sentinelRef.current;
        if (sentinel) {
            observerRef.current.observe(sentinel);
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [initialLoadDone, loadNext]);

    return (
        showNoData && gameList.length === 0 ? <NoDataAvailable info={`Nothing is found`}/>
            : <>
                <div
                    className={`items-grid ${gameDynamicClass ?? 'items-grid--cols5'} grid__columns--3 grid__column-gap--16`}>
                    {gameList.map((g, i) => (
                        <Fragment key={`${g?.id ?? 'sk'}-${i}`}>
                            <GameSlot game={g} isLoading={!g}/>
                        </Fragment>
                    ))}
                </div>

                <div ref={sentinelRef} style={{height: 10}}/>
            </>
    );
};

export default GameListRenderer;
