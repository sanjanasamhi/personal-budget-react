import React from "react";
import BudgetChart from '../BudgetChart/BudgetChart'; // Adjust the path as necessary

function HomePage() {
  return (
    <main className="center" id="main">
      <section className="page-area">
        <article>
          <h3>Stay on track</h3>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article>
          <h3>Results</h3>
          <p>
              People who stick to a financial plan, budgeting every expense, get out of debt faster!
              Also, they to live happier lives... since they expend without guilt or fear...
              because they know it is all good and accounted for.
          </p>
      </article>

        <article>
          <h3>Alerts</h3>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article>
          <h3>Results</h3>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they live happier lives... since they expend without guilt or fear... 
            because they know it is all good and accounted for.
          </p>
        </article>

        <article>
          <h3>Chart</h3>
          <p>
            The pie chart represents the distribution of your budget across different categories.
          </p>
          
         
          <BudgetChart /> 
          <h3>D3JS Chart</h3>
          <p>
            The above pie chart represents the distribution of your budget across different categories.
          </p>
        </article>

      

      </section>
    </main>
  );
}

export default HomePage;
