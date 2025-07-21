/* Task 2 – Basic CRUD */
// 2.1 All books in the genre "Fiction"
db.books.find({ genre: "Fiction" });

// 2.2 Books published after 1950
db.books.find({ published_year: { $gt: 1950 } });

// 2.3 Books by George Orwell
db.books.find({ author: "George Orwell" });

// 2.4 Update price of "1984"
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 13.99 } }
);

// 2.5 Delete a book by title
db.books.deleteOne({ title: "The Alchemist" });

/* Task 3 – Advanced Queries */
// 3.1 In-stock & published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 3.2 Projection – title, author, price only
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 3.3 Sorting
db.books.find().sort({ price: 1 });   // ascending
db.books.find().sort({ price: -1 });  // descending

// 3.4 Pagination – 5 books per page
db.books.find().skip(0).limit(5); // page 1
db.books.find().skip(5).limit(5); // page 2

/* Task 4 – Aggregation */
// 4.1 Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// 4.2 Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 1 }
]);

// 4.3 Books grouped by decade
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

/* Task 5 – Indexing */
// 5.1 Single-field index on title
db.books.createIndex({ title: 1 });

// 5.2 Compound index on author + published_year
db.books.createIndex({ author: 1, published_year: 1 });

// 5.3 Check performance
db.books.find({ title: "1984" }).explain("executionStats");
db.books.find({ author: "George Orwell", published_year: { $gte: 1940 } })
        .explain("executionStats");
