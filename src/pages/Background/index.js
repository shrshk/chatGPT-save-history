const { searchNotion } = require('../../../utils/notionClient')


console.log('This is the background page.');
console.log('Put the background scripts here.');

(async () => {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log('made it here I guess')
      if (request.greeting === "hello") {
        searchNotion().then((res) => {
          console.log('res from notion ' + JSON.stringify(res))
          sendResponse(res)
        })
      }
    });
})()