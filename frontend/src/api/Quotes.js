

const Quotes = async function main() {
  try {
    const response = await fetch(
      "https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom",
      {
        headers: {
          "X-Api-Key": "H01wMgxsxL9VtjE5yLP6SrpOl8Tb7udXiFH59U0P",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data.map(({ quote, author }) => ({
      quote,
      author,
    }));
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
  }
};

export default Quotes;
