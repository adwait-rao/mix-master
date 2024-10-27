import { useLoaderData, Link, Navigate } from "react-router-dom";
import axios from "axios";
import Wrapper from "../assets/wrappers/CocktailPage";
import { useQuery } from "@tanstack/react-query";

const singleCocktailQuery = (id) => {
  return {
    queryKey: ["cocktail", id],
    queryFn: async () => {
      const { data } = await axios.get(`${singleCocktailURL}${id}`);
      return data;
    },
  };
};

const singleCocktailURL =
  "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;
    await queryClient.ensureQueryData(singleCocktailQuery(id));
    return { id };
  };

export default function Cocktail() {
  const { id } = useLoaderData();
  const { data } = useQuery(singleCocktailQuery(id));

  if (!data) return <Navigate to="/" />;

  const drink = data.drinks[0];
  const {
    strDrink: name,
    strDrinkThumb: image,
    strAlcoholic: info,
    strCategory: category,
    strGlass: glass,
    strInstructions: instructions,
  } = drink;

  const getIngredients = (obj) => {
    const entries = Object.entries(obj);
    const ingredients = entries.filter((entry) => {
      if (entry[0].startsWith("strIngredient") && entry[1]) {
        return true;
      }
    });
    return ingredients
      .map((item) => {
        return item[1];
      })
      .join(", ");
  };
  return (
    <Wrapper>
      <header>
        <Link to="/" className="btn">
          back home
        </Link>
        <h3>{name}</h3>
      </header>
      <div className="drink">
        <img src={image} alt={name} className="img" />
        <div className="drink-info">
          <p>
            <span className="drink-data">name :</span>
            {name}
          </p>
          <p>
            <span className="drink-data">category :</span> {category}
          </p>
          <p>
            <span className="drink-data">info :</span> {info}
          </p>
          <p>
            <span className="drink-data">glass :</span> {glass}
          </p>
          <p>
            <span className="drink-data">ingredients :</span>{" "}
            {getIngredients(drink)}
          </p>
          <p>
            <span className="drink-data">instructons :</span> {instructions}
          </p>
        </div>
      </div>
    </Wrapper>
  );
}
