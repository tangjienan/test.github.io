import { getSecret } from './key.js'

document.addEventListener('DOMContentLoaded', async function (event) {
    // your code here

    // alert('page loaded')

    let keys = await getSecret()

    console.log(keys)

    fetch(
        `https://api.unsplash.com/search/photos?query=dogs&client_id=${keys.unsplash_client_id}`
    )
        .then((response) => response.json())
        .then((data) => console.log(data))
})
