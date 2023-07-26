import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "io.ionic.starter",
    appName: "my-app",
    webDir: "dist",
    server: {
        androidScheme: "https",
    },
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
    },
};

export default config;
