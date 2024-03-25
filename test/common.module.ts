import { WebdriverIOQueries } from "@testing-library/webdriverio";

declare global {
    namespace WebdriverIO {
        interface Browser extends WebdriverIOQueries { }
        interface Element extends WebdriverIOQueries { }
    }
}