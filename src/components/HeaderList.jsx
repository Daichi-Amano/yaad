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
    <nav class="text-white font-neue font-semibold flex flex-col justify-between md:h-[6.8rem]">
      <p class="text-[1.4rem]">
        {("0" + ($activeIndex + 1)).slice(-2)} /{" "}
        <span class="text-white/50">{("0" + contents.length).slice(-2)}</span>
      </p>
      <div class="hidden md:flex flex-col justify-center gap-[0.5rem] h-[3.7rem] overflow-hidden">
        {viewList.map(({ content, index }) => {
          return (
            <p
              class={`text-[1.5rem] leading-[100%] ${
                $activeIndex === index ? "opacity-100" : "opacity-50"
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
