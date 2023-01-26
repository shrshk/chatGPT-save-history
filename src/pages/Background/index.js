const { createPage } = require('../../../utils/notionClient')

console.log('This is the background page.');
console.log('Put the background scripts here.');

(async () => {
  if (!chrome.runtime) {
    return
  }
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      callNotion(request.payload).then(res => {
        sendResponse(res)
      })

      return true
  });

  async function callNotion(payload) {
    return await createPage(payload)
  }

})()