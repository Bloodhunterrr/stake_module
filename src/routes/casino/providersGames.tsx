import ArrowUpIcon  from '@/assets/icons/arrow-up.svg?react';
import { useNavigate, useParams } from 'react-router';
import './subCategoryGames.css';
;

import {
  useGetMainQuery,
} from '@/services/mainApi';
import {
  useEffect,
  useState,
} from 'react';
import type {Provider} from '@/types/main';
import Footer from '@/components/shared/footer';
import GameListRenderer from './gameListRenderer';

type DataTree = Record<string, Provider>;

const ProvidersGames = () => {
  const navigate = useNavigate();

  const { providerCode } = useParams<{ providerCode: string }>();

  const { data: mainData } = useGetMainQuery();
  const [dataTree, setDataTree] = useState<DataTree | null>(null);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);


  useEffect(() => {
    if (!mainData) return;
    const tree: DataTree = {};
    mainData.forEach(({ providers }) => {
        providers.forEach((provider) => {
            const { code } = provider;
            tree[code] = provider
        })
    });
    setDataTree(tree);
  }, [mainData]);

  const provider = dataTree?.[providerCode as string];

  useEffect(() => {
    if (dataTree && (!provider)) navigate(-1);
  }, [dataTree, provider, navigate]);

  return (
    <>
      <div className="category-wrapper">
        <section id="category-section" className="CategorySection">
          <div className="category-games-section">
            <div className="items-grid-wrapper">
              <div className="items-grid-header items-grid-header--sticky">
                <div className="Wrapper">
                  <div className="list-header">
                    <div className="list-header__button">
                      <button
                        onClick={() => navigate(-1)}
                        className="m-button m-gradient-border m-button--secondary m-button--m"
                      >
                        <div className="m-icon-container">
                          <ArrowUpIcon
                            className="m-icon m-icon-loadable"
                            style={{ transform: 'rotate(270deg)' }}
                          />
                        </div>
                      </button>
                    </div>

                    <div>
                      <p className="m-text m-fs16 m-fw700 m-lh150">
                        {provider?.name ?? ''}
                        
                      </p>
                      {totalGames > 0 && <p
                        className="m-text m-fs12 m-fw500 m-lh160"
                        style={{ color: 'var(--color-mid-grey-1)' }}
                      >
                        {totalGames} <div>games</div>
                      </p>}
                    </div>

                    <div className="list-header__sort">
                      <button
                        onClick={() => setIsSortingEnabled((p) => !p)}
                        className={`m-button m-gradient-border m-button--${isSortingEnabled
                            ? 'primary'
                            : 'outline m-button--secondary'
                          } m-button--m`}
                      >
                        <div className="m-button-content">
                          <p
                            className="m-text m-fs12 m-fw600 m-lh160"
                            style={{ color: 'var(--color-white)' }}
                          >
                            A-Z
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Wrapper">
                <GameListRenderer
                  providerId={provider?.id}
                  order_by={isSortingEnabled ? 'name' : 'order'}
                  onTotalChange={setTotalGames}
                  gameDynamicClass="items-grid--cols6"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ProvidersGames;