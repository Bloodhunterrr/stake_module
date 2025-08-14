// import Slider from "react-slick";
// import "./lobbyBanner.css";
//
// import ArrowUpIcon  from "@/assets/icons/arrow-up.svg?react";
// import banner1 from "@/assets/images/lobby-banner-1.webp";
// import banner2 from "@/assets/images/lobby-banner-2.webp";
// import banner3 from "@/assets/images/lobby-banner-3.webp";
//
// const NextArrow = ({ onClick }: any) => (
//   <div className="custom-arrow next-arrow" onClick={onClick}>
//     <button className="m-button m-gradient-border m-button--secondary m-button--m">
//       <ArrowUpIcon
//         className="m-icon m-icon-loadable m-chevron"
//         style={{ transform: "rotate(90deg)" }}
//       />
//     </button>
//   </div>
// );
//
// const PrevArrow = ({ onClick }: any) => (
//   <div className="custom-arrow prev-arrow" onClick={onClick}>
//     <button className="m-button m-gradient-border m-button--secondary m-button--m">
//       <ArrowUpIcon
//         className="m-icon m-icon-loadable m-chevron"
//         style={{ transform: "rotate(-90deg)" }}
//       />
//     </button>
//   </div>
// );
//
// const slides = [
//   {
//     id: 1,
//     image: banner1,
//     title: "SECOND DEPOSIT BONUS",
//     description: "55% up to",
//     subDescription: "€500 + 100 Free Spins",
//     buttonTitle: "Deposit Now",
//   },
//   {
//     id: 2,
//     image: banner2,
//     title: "ROOKIE RUMBLE TOURNAMENT",
//     description: "€2,500 Daily",
//     subDescription: "",
//     buttonTitle: "Begin Now",
//   },
//   {
//     id: 3,
//     image: banner3,
//     title: "WEEKLY CASHBACK",
//     description: "up to 25%",
//     subDescription: "",
//     buttonTitle: "Read More",
//   },
//  {
//     id: 4,
//     image: banner1,
//     title: "SECOND DEPOSIT BONUS",
//     description: "55% up to",
//     subDescription: "€500 + 100 Free Spins",
//     buttonTitle: "Deposit Now",
//   },
//   {
//     id: 5,
//     image: banner2,
//     title: "ROOKIE RUMBLE TOURNAMENT",
//     description: "€2,500 Daily",
//     subDescription: "",
//     buttonTitle: "Begin Now",
//   },
// ];
//
// export default function LobbyBannerSlider() {
//   const settings = {
//     dots: true,
//     arrows: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 640,
//         settings: { slidesToShow: 1 },
//       },
//     ],
//   };
//
//   return (
//     <section className="slider-wrapper">
//       <Slider {...settings} className="lobby-banner-slider">
//         {slides.map((slide) => (
//           <div className="lobby-banner-slide" key={slide.id}>
//             <div
//               className="lobby-banner-slide-content"
//               style={{ backgroundImage: `url(${slide.image})` }}
//             >
//               <div className="slide-text">
//                 <div className="m-badge m-badge--secondary m-badge--m m-gradient-border">
//                   {slide.title}
//                 </div>
//                 <div className="lobby-banner-text">
//                   <h4
//                     className="m-text Header-Black-S"
//                     style={{ color: "var(--color-at400)" }}
//                   >
//                     {slide.description}
//                   </h4>
//                   <p
//                     className="m-text Body-Semi-Bold-M"
//                     style={{ color: "var(--color-at400)" }}
//                   >
//                     {slide.subDescription}
//                   </p>
//                 </div>
//                 <button className="m-button m-gradient-border m-button--primary m-button--s">
//                   {slide.buttonTitle}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </section>
//   );
// }
