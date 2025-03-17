// import plugin from "tailwindcss/plugin";

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
                "cinestar-purple": "#6d28d9",
            },
            backgroundImage: {

            },
            animation: {
                'border-spin': 'borderSpin 1s linear forwards',
            },
            keyframes: {
                borderSpin: {
                    '0%': {
                        'clip-path': 'inset(0 50% 100% 50%)', // Chỉ hiển thị điểm bắt đầu ở giữa trên (12h)
                    },
                    '25%': {
                        'clip-path': 'inset(0 0 50% 0)', // Vẽ đến 3h
                    },
                    '50%': {
                        'clip-path': 'inset(0 0 0 0)', // Vẽ đến 6h
                    },
                    '75%': {
                        'clip-path': 'inset(50% 0 0 0)', // Vẽ đến 9h
                    },
                    '100%': {
                        'clip-path': 'inset(0 0 0 0)', // Hoàn thành vòng, hiển thị toàn bộ border
                    },
                },
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
