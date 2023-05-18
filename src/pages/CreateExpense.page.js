import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExpenseForm from "../components/ExpenseForm.component";
import { useNavigate } from "react-router-dom";

const CreateExpense = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "640",
    // To: "Default",
    mode: "Credit Card",
    title: "Online Course",
    createdAt: new Date(),
  });

  // GraphQL query to create an expense
  const createExpenseQuery = gql`
    mutation AddExpense($data: ExpenseInsertInput!) {
      insertOneExpense(data: $data) {
        _id
      }
    }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an expense will be passed through queryVariables.
  const queryVariables = {
    data: {
      title: form.title,
      amount: parseInt(form.amount),
      mode: form.mode,
      To: form.To,
      author: user.id,
      createdAt: form.createdAt,
    },
  };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` };

  const [acounts, setAccounts] = useState([]);
  const getAllAcounts = gql`
    query getAllAcounts {
      acounts(sortBy: CREATEDAT_DESC) {
        _id
        account_id
        createdAt
        Avalible
      }
    }
  `;

  const queryVariables2 = {};
  const loadAccounts = async () => {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllAcounts,
      queryVariables2,
      headers
    );
    setAccounts((_) =>
      resp.acounts.map((acount) => ({ ...acount, key: acount._id }))
    );
    // console.log("asd",resp.acounts);
  };

  // console.log(acounts);

  const [expenses, setExpenses] = useState([]);
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

  const loadExpenses = async () => {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllExpensesQuery,
      queryVariables,
      headers
    );
    setExpenses((_) =>
      resp.expenses.map((expense) => ({ ...expense, key: expense._id }))
    );
  };

  useEffect(() => {
    loadAccounts();
    loadExpenses();
  }, []);

  // all transactions of user in that day
  var today = new Date();
  var todayExpenses = expenses.filter((expense) => {
    var d = new Date(expense.createdAt);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  var sum = todayExpenses.reduce((acc, expense) => {
    // console.log(expense.To, user.id);
    // console.log(expense);
    if (expense.To != user.id) {
      return acc + expense.amount;
      // console.log("in if
    }
    return acc;
  }, 0);
  console.log("sum", sum);

  var balance = expenses.reduce((acc, expense) => {
    // console.log(expense.To, user.id);
    // console.log(expense);
    if (expense.To != user.id) {
      return acc - expense.amount;
      // console.log("in if
    }
    return acc + expense.amount;
  }, 0);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { amount, To, mode, title } = form;
    if (
      amount.length === 0 ||
      To.length === 0 ||
      mode.length === 0 ||
      title.length === 0
    ) {
      return;
    }
    if (isNaN(parseInt(amount))) {
      alert("Amount must be a number");
      return;
    }
    if (parseInt(amount) < 100) {
      alert("Amount must be greater than 100");
      return;
    }
    if (To === "Default") {
      alert("Please select a To");
      return;
    }
    if (sum + parseInt(amount) > 7000) {
      alert("You have reached the limit of 7000");
      return;
    }
    if (To === user.id) {
      alert("You can't send money to yourself");
      return;
    }
    if (balance - parseInt(amount) < 0) {
      alert("You don't have enough money");
      return;
    }
    // if account is not avalible
    var flag = 0;
    acounts.forEach((element) => {
      if (element.account_id === To) {
        if (element.Avalible === false) {
          flag = 1;
        }
      }
    });
    if (flag === 1) {
      alert("Account is not avalible ");
      return;
    }

    try {
      await request(
        GRAPHQL_ENDPOINT,
        createExpenseQuery,
        queryVariables,
        headers
      );

      // Navigate to the Home page after creating an expense
      navigate(`/`);
    } catch (error) {
      alert(error);
    }
  };
  // create a set of unique values
  var uniquev = new Set();

  // console.log(acounts);
  // get  unique values of acount_id from acounts
  acounts.forEach((element) => {
    uniquev.add(element.account_id);
  });
  // uniquev to list
  uniquev = [...uniquev];
  // console.log(uniquev);

  // var uniquev = [];
  return (
    <PageContainer>
      <h2>
        Balance: ${" "}
        {
          // add if user id == author else rest
          balance
        }
      </h2>
      <ExpenseForm
        onSubmit={onSubmit}
        form={form}
        setForm={setForm}
        title="Create Expense"
        ToOptions={uniquev}
      />
    </PageContainer>
  );
};

export default CreateExpense;
