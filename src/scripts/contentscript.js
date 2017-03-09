import ext from "./utils/ext";

console.log('Running content script');

ext.runtime.onMessage.addListener(() => console.log('Hello World'));