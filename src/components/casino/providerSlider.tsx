import type {Provider} from "@/types/main";

import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useNavigate } from "react-router";

const ProviderSlider = ({ providers }: { providers: Provider[] }) => {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  return (
    <section>
      <div>
        <div>
          <h2>
            <div>Providers</div>
          </h2>
          <button onClick={() => navigate(`/providers`)}>
            <div>
              <span>
                <div>View all</div>
              </span>
              {isDesktop && <div>{providers.length}</div>}
            </div>
          </button>
        </div>

        <div >
          {providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => navigate(`/provider/${provider.code}`)}
            >
              {provider.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProviderSlider;
