const config = {
    skinName: import.meta.env.VITE_HAYASPIN_SKIN_NAME ?? "Hayaspin",
    baseUrl: import.meta.env.VITE_HAYASPIN_BASE_URL ?? "https://stage-api.hayaspin.com",
    sportUrl: import.meta.env.VITE_HAYASPIN_SPORT_URL ?? "https://spsh.gsportsbook.com/en/sport?serverUrl=https%3A%2F%2Fapispsh.gsportsbook.com&lang=",
    languages: ["en", "it"]
}
export default config