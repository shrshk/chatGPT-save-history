const { createPage } = require('../../../utils/notionClient');

(async () => {
  if (!chrome.runtime) {
    console.log('something is fishy')
    return
  }
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log('made it to background')

      callNotion(request.payload).then(res => {
        sendResponse(res)
      })

      return true
  });

  async function callNotion(payload) {
    return await createPage(payload)
  }

})()