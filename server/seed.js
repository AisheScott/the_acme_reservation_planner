const {
    client,
    createTables,
    createCustomer,
    fetchCustomers,
    createRestaurant,
    fetchRestaurant,
    createReservation,
    fetchReservations,
    destroyReservation,
  } = require("./db");

  const init = async () => {
    await client.connect();
    console.log("connected to database");
  
    createTables();
    console.log("tables created ");

    const [Scott, John, Jack, BWW, Applebees, JohnyRockets, PizzaHut] = await Promise.all([

        createCustomer("Scott"),
        createCustomer("John"),
        createCustomer("Jack"),
        createRestaurant("BWW"),
        createRestaurant("Applebees"),   
        createRestaurant("JohnyRockets"),
        createRestaurant("PizzaHut"),

    ]);
    console.log("Customers and Restaurants created")

  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());

  const [res1] = await Promise.all([
    createReservation({
      date: "4/19/2025",
      party_count: 4,
      restaurant_id: BWW.id,
      customer_id: Scott.id,
    }),
    createReservation({
      date: "4/18/2025",
      party_count: 6,
      restaurant_id: Applebees.id,
      customer_id: John.id,
    }),
  ]);

  console.log("Reservations");
  console.log(await fetchReservations());

  await destroyReservation(res1.id, Scott.id);
  console.log("Deleted Reservation");
};

init();