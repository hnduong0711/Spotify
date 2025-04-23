export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    mode: "jit",
    theme: {
        screens: {
            xs: "375px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
        extend: {
            colors: {
                "spotify-base": "#1ed760",
                "spotify-highlight": "#3be477",
            },
        },
    },
    // plugins: [
    //   plugin(function ({ addBase, addComponents }) {
    //     addBase({});
    //     addComponents({
    //       ".button": {
    //         "@apply text-[14px] font-bold flex rounded-md items-center justify-center cursor-pointer relative overflow-hidden":
    //           {},
    //         ".md:button": {
    //           "@apply flex": {},
    //         },
    //       },
    //       ".select-data-btn": {
    //         "@apply border border-cinestar-purple rounded-md text-[16px] flex  px-2 py-3  bg-white font-bold overflow-hidden text-ellipsis whitespace-nowrap":
    //           {},
    //       },
    //       ".heading": {
    //         "@apply text-4xl tracking-wide uppercase": {},
    //       },
    //     });
    //   }),
    // ],
};
