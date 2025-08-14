import { useState } from "react";
import { useNavigate, useParams } from "react-router";
;

import Modal from "@/components/shared/modal";
import Search from "./search";

import FeedbackIcon  from "@/assets/icons/feedback-category-icon.svg?react";
import type {Subcategory} from "@/types/main";

type Props = {
  data: Record<string, { subcategories: Subcategory[] }>[];
};

const SubcategorySlider = ({ data }: Props) => {
  const [searchModal, setSearchModal] = useState(false);
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  

  const selectedCategory = data.find(
    (entry) => Object.keys(entry)[0] === categorySlug
  );

  const subcategories = selectedCategory
    ? Object.values(selectedCategory)[0]?.subcategories ?? []
    : [];

  if (subcategories.length <= 1) {
    return null;
  }

  return (
    <>
      <section>
        <h2>Subcategories of {categorySlug}</h2>
        <div>
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() =>
                navigate(`/${categorySlug}/games/${subcategory.slug}`)
              }
              style={{ cursor: "pointer", marginBottom: 6 }}
            >
              {subcategory.name}
            </div>
          ))}
        </div>

        <div
          onClick={() => setSearchModal(true)}
          style={{ marginTop: 16, cursor: "pointer" }}
        >
          <FeedbackIcon />
          <div>Providers</div>
        </div>
      </section>

      {searchModal && (
        <Modal
          width={700}
          title={`Search`}
          onClose={() => setSearchModal(false)}
          additionalClass="search-modal search-modal--search"
        >
          <Search onCloseSearchModal={() => setSearchModal(false)} />
        </Modal>
      )}
    </>
  );
};

export default SubcategorySlider;
