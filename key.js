export var getSecret = async () => {
    let res = null

    await fetch('./secrets.json')
        .then((res) => res.json())
        .then((json) => {
            res = json
        })

    return res
}
