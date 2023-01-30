const { createPage } = require('../../../utils/notionClient')

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