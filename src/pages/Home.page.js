import { useContext, useEffect, useState } from "react";
import request, { gql } from "graphql-request";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseCard from "../components/ExpenseCard.component";
import { el, es } from "date-fns/locale";

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);

  const [expenses, setExpenses] = useState([]);

  // GraphQL query to fetch all the expenses from the collection.
  const getAllExpensesQuery = gql`
    query getAllExpenses {
      expenses(sortBy: CREATEDAT_DESC) {
        _id
        title
        amount
        mode
        To
        createdAt
        author
      }
    }
  `;

  // Since we don't want to filter the results as of now,
  // we will just use the empty query object
  const queryVariables = {};

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` };

  // loadExpenses function is responsible for making the GraphQL
  // request to Realm and update the expenses array from the response.
  const loadExpenses = async () => {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllExpensesQuery,
      queryVariables,
      headers
    );

    setExpenses((_) =>
      resp.expenses.map((expense) => ({
        ...expense,
        key: expense._id,
        afterDelete,
      }))
    );
  };

  // useEffect(() => {
  // loadExpenses();
  // }, []);
  const initdeposit = async () => {
    // wait to get the expenses
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllExpensesQuery,
      queryVariables,
      headers
    ).then(async (resp) => {

      
      
      if (resp.expenses.length === 0) {

        // add user id to the Accounts database
        const createAccountQuery = gql`
          mutation AddAcount($data: AcountInsertInput!) {
            insertOneAcount(data: $data) {
              _id
              account_id
              createdAt
              Avalible
            }
          }
        `;
        const queryVariables1 = {
          data: {
            account_id: user.id,
            createdAt: new Date(),
            Avalible: true,
          },
        };
        const resp1 = await request(
          GRAPHQL_ENDPOINT,
          createAccountQuery,
          queryVariables1,
          headers
        );
        // create a new expense  for the user
        const createExpenseQuery = gql`
          mutation AddExpense($data: ExpenseInsertInput!) {
            insertOneExpense(data: $data) {
              _id
              amount
            }
          }
        `;
        // send the expense to the user
        const queryVariables2 = {
          data: {
            title: "Welcome to your new account!",
            amount: 10000,
            mode: "Bank transfer",
            To: user.id,
            author: user.id,
            createdAt: new Date(),
          },
        };
        const resp2 = await request(
          GRAPHQL_ENDPOINT,
          createExpenseQuery,
          queryVariables2,
          headers
        );
      
        
      }
      loadExpenses();
      
    });

    // check if the user has any expenses
  };

  // initdeposit();
  useEffect(() => {
    // loadExpenses();
    initdeposit();
  }, []);
  // loadExpenses();
  // Helper function to be performed after an expense has been deleted.
  const afterDelete = () => {
    loadExpenses();
    // initdeposit();
  };
  loadExpenses()

  var balance  = expenses.reduce((acc, expense) => {
    // console.log(expense.To, user.id);
    // console.log(expense);
    if (expense.To != user.id) {
      expense.amount = -expense.amount;
      // console.log("in if
    }
    return acc + expense.amount;
  }, 0);

    // if balance > 20000 make account unavalible
    if (balance > 20000) {
      const updateAccountQuery = gql`
        mutation UpdateAccount($query: AcountQueryInput!, $set: AcountUpdateInput!) {
          updateOneAcount(query: $query, set: $set) {
            _id
            account_id
            createdAt
            Avalible
          }
        }
      `;
      const queryVariables3 = {
        query: {
          account_id: user.id,
        },
        set: {
          Avalible: false,
        },
      };
      const resp3 = request(
        GRAPHQL_ENDPOINT,
        updateAccountQuery,
        queryVariables3,
        headers
      );
    }
    // if balance < 20000 make account avalible
    if (balance < 20000) {
      const updateAccountQuery = gql`
        mutation UpdateAccount($query: AcountQueryInput!, $set: AcountUpdateInput!) {
          updateOneAcount(query: $query, set: $set) {
            _id
            account_id
            createdAt
            Avalible
          }
        }
      `;
      const queryVariables3 = {
        query: {
          account_id: user.id,
        },
        set: {
          Avalible: true,
        },
      };
      const resp3 = request(
        GRAPHQL_ENDPOINT,
        updateAccountQuery,
        queryVariables3,
        headers
      );
    }
    





  return (
    <PageContainer>
      {/* <p>Hi {user.name}!</p> */}
      <h2>Account ID: {user.id}</h2>

      <h2>
        Balance: ${" "}
        {
          balance
          // add if user id == author else rest
          
        }
      </h2>
      {expenses.map((expense) => (
        <ExpenseCard {...expense} />
      ))}
    </PageContainer>
  );
};

export default Home;
