import { useStore } from "@nanostores/preact";
import { activeIndex } from "../lib/store";
import { useEffect, useState } from "preact/hooks";
// import { register } from "swiper/element/bundle";
// import "swiper/css";

export default function HeaderList({ contents }) {
  const $activeIndex = useStore(activeIndex);
  const [viewList, setViewList] = useState([]);

  // useEffect(() => {
  //   register();
  // }, []);
  useEffect(() => {
    // const content = document.querySelector(`#main-content-${$activeIndex}`);
    // content.scrollIntoView({ behavior: "smooth" });

    if ($activeIndex === 0) {
      setViewList([
        { content: contents[contents.length - 1], index: contents.length - 1 },
        { content: contents[$activeIndex], index: $activeIndex },
        { content: contents[$activeIndex + 1], index: $activeIndex + 1 },
      ]);
    } else if ($activeIndex === contents.length - 1) {
      setViewList([
        { content: contents[$activeIndex - 1], index: $activeIndex - 1 },
        { content: contents[$activeIndex], index: $activeIndex },
        { content: contents[0], index: 0 },
      ]);
    } else {
      setViewList([
        { content: contents[$activeIndex - 1], index: $activeIndex - 1 },
        { content: contents[$activeIndex], index: $activeIndex },
        { content: contents[$activeIndex + 1], index: $activeIndex + 1 },
      ]);
    }
  }, [$activeIndex]);

  return (
    <nav>
      <p class="nav-no">
        {("0" + ($activeIndex + 1)).slice(-2)}/
        {("0" + contents.length).slice(-2)}
      </p>
      {/* <swiper-container
        // class="nav-titles"
        space-between="0"
        // style="display:block; height: 5.4rem;"
        slide-per-view="3"
        free-mode="true"
        free-mode-sticky="true"
        free-mode-momentum-radio="0.8"
        free-mode-momentum-velocity-ratio="0.25"
        free-mode-momentum-minimum-velocity="0.1"
        mouse-wheel-control="true"
        mouse-wheel-sensitive="0.5"
        loop="true"
        direction="vertical"
        slide-to-clicked-slide="true"
        centerd-slides="true"
      >
        {contents.map((content) => {
          return (
            <swiper-slide>
              <p>{content.title}</p>
            </swiper-slide>
          );
        })}
      </swiper-container> */}
      <div class="nav-titles">
        {viewList.map(({ content, index }) => {
          return (
            <p
              class={`nav-title ${
                $activeIndex === index ? "nav-title--active" : ""
              }`}
            >
              {content.title}
            </p>
          );
        })}
      </div>
    </nav>
  );
}
