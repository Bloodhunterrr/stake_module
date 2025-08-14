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
import type {Subcategory} from '@/types/main';
import Footer from '@/components/shared/footer';
import GameListRenderer from './gameListRenderer';
import SubcategorySlider from '@/components/casino/subcategorySlider';

interface Category {
  id: number;
  slug: string;
  name: string;
  subcategories: Record<string, Subcategory>;
}
type DataTree = Record<string, Category>;

const SubcategoryGames = () => {
  const navigate = useNavigate();
  const { categorySlug = '', subCategorySlug = '' } = useParams<{
    categorySlug: string;
    subCategorySlug: string;
  }>();

  const { data: mainData } = useGetMainQuery();
  const [dataTree, setDataTree] = useState<DataTree | null>(null);
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [totalGames, setTotalGames] = useState<number>(0);


  useEffect(() => {
    if (!mainData) return;
    const tree: DataTree = {};
    mainData.forEach(({ id, slug, name, subcategories }) => {
      tree[slug] = { id, slug, name, subcategories: {} };
      subcategories?.forEach((s) => {
        tree[slug].subcategories[s.slug] = s;
      });
    });
    setDataTree(tree);
  }, [mainData]);

  const category = dataTree?.[categorySlug];
  const subcategory = category?.subcategories[subCategorySlug];

  useEffect(() => {
    if (dataTree && (!category || !subcategory)) navigate(-1);
  }, [dataTree, category, subcategory, navigate]);

  return (
    <>
      <div className="category-wrapper">
        {mainData && <SubcategorySlider
                data={mainData.map((category) => {
                  return {
                    [category.slug]: {
                      subcategories: category.subcategories || [],
                    },
                  };
                })}
              /> }
         
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
                        {subcategory?.name ?? 'Top Games'}
                        
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
                  categoryId={subcategory?.id}
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

export default SubcategoryGames;