export const fecthHygraphQuery = async (
    query: string,
    revalidate?: number
) => {
    const response = await fetch(process.env.HYGRAPH_URL!, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Autorization: `Beares ${process.env.HYGRAPH_TOKEN}`
        },
        body: JSON.stringify({ query }),
        next: {
            revalidate
        }
    })

    const { data } = await response.json()

    return data
}

