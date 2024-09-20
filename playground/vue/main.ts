import { createApp } from "vue";

import App from "./App.vue";
import Page from "./components/Page.vue";
import Teaser from "./components/Teaser.vue";
import Grid from "./components/Grid.vue";
import Feature from "./components/Feature.vue";

const app = createApp(App);

app.component("Page", Page);
app.component("Teaser", Teaser);
app.component("Grid", Grid);
app.component("Feature", Feature);

app.mount("#app");
