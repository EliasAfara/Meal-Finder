// APIs Site: https://www.themealdb.com/api.php
// Search meal by name: https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
// Lookup full meal details by id: https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
// Lookup a single random meal: https://www.themealdb.com/api/json/v1/1/random.php

const searchInput = document.getElementById('search'),
  formSubmit = document.getElementById('form-submit'),
  randomBtn = document.getElementById('random-btn'),
  searchKeyword = document.getElementById('search-keyword'),
  meals = document.getElementById('meals'),
  singleMeal = document.getElementById('single-meal');

const searchMeal = async (e) => {
  e.preventDefault();
  const input = searchInput.value;
  searchKeyword.innerHTML = '';
  singleMeal.innerHTML = '';

  if (input.trim()) {
    try {
      const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
      ).then((res) => res.json());

      if (data.meals === null) {
        searchKeyword.innerHTML = `There are no search results. Try again!`;
      } else {
        searchKeyword.innerHTML = `<h2>Showing result for: ${input}</h2>`;
        meals.innerHTML = data.meals
          .map(
            (meal, index) => `
          <div class='meal' key='${index}'>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>

            <div class='meal-info' data-mealID='${meal.idMeal}'>
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `
          )
          .join('');
        searchInput.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    alert('Please enter a valid term.');
  }
};

const displayMeal = (mealDetails) => {
  const ingredient1 = [];
  for (let i = 1; i <= 20; i++) {
    if (mealDetails[`strIngredient${i}`].length > 0) {
      ingredient1.push(
        `${mealDetails[`strIngredient${i}`]} - ${mealDetails[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  singleMeal.innerHTML = `<div class='single-meal'>
    <h1>${mealDetails.strMeal}</h1>
    <img src='${mealDetails.strMealThumb}' alt='${mealDetails.strMeal}'/>

    <div class='single-meal-info'>
      ${mealDetails.strCategory ? `<p>${mealDetails.strCategory}</p>` : ''}
      ${mealDetails.strArea ? `<p>${mealDetails.strArea}</p>` : ''}
    </div>

    <div class='single-meal-details'>
      ${
        mealDetails.strInstructions
          ? `<p>${mealDetails.strInstructions}</p>`
          : ''
      }
      <h2>Ingrediants</h2>
      <ul>
        ${ingredient1.map((ing) => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>`;
};

const getMealById = async (mealID) => {
  try {
    const mealData = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    ).then((res) => res.json());

    displayMeal(mealData.meals[0]);

    document.querySelector('#single-meal').scrollIntoView({
      behavior: 'smooth',
    });
  } catch (err) {
    console.error(err);
  }
};

const getMealDetails = (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID);
  }
};

const getRandomMealDetails = async () => {
  searchKeyword.innerHTML = '';
  meals.innerHTML = '';

  try {
    const mealData = await fetch(
      'https://www.themealdb.com/api/json/v1/1/random.php'
    ).then((res) => res.json());

    displayMeal(mealData.meals[0]);
  } catch (err) {
    console.error(err);
  }
};

formSubmit.addEventListener('submit', searchMeal);
meals.addEventListener('click', getMealDetails);
randomBtn.addEventListener('click', getRandomMealDetails);
