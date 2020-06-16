import { setupWebGL, drawRectangle } from "./utils/index";

const initializedContext = setupWebGL();

drawRectangle(initializedContext, 0, 0, 10, 10);
