import { useEffect, useState } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    // useEffect는 Promise를 return해서는 안됌.
    // 그러므로 아래와 같이 새로운 함수를 만든 후, 해당 함수 안에서 async-await 패턴을 사용해야 한다.
    const fetchMeals = async () => {
      const response = await fetch(
        "https://all-the-practice-default-rtdb.firebaseio.com/meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    // 위의 async-await 함수는 promise를 return하며, 이로 인해 위의 함수에서 발생시킨
    // error가 자동으로 reject 되므로(return되지 않는 것을 의미)
    // 아래와 같은 방식의 try-catch 패턴은 error를 잡아내지 못한다.
    // try {
    //   fetchMeals();
    // } catch (error) {
    //   setIsLoading(false);
    //   setHttpError(error.message);
    // }
    // 대신에 아래와 같은 방식의 패턴은 적용할 수 있으나
    // try {
    //   await fetchMeals();
    // } catch(error) {
    //   setIsLoading(false);
    //   setHttpError(error.meassge);
    // }
    // 이 방식은, useEffect hook 자체에 async-await 패턴을 적용해야만 해서
    // 사용이 불가능하다.

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
