const csv = require('csv-parser');
const fs = require('fs');
const { format } = require('path');
const { formatDate } = require('../server/utils');


const results = [];

const file = 'goodreads_library_export.csv';

const template = ['Title', 'ISBN', 'Author'];


function formatToMarkdown(template, data) {
  // console.log(data);

  // const obj = template.forEach((key) => {

  //   const str = JSON.stringify(key).substring(1, key.length + 1) + ': ' + JSON.stringify(data[key]);

  //   // console.log(str);
  //   return textObj.push(str); // Object.assign(o, { [key]: data[key] }), {}
  // });

  // const finalString = "" + JSON.stringify(textObj[0]) + JSON.stringify(textObj[1]) + "";

  function objToString(obj) {
    return Object.entries(obj).reduce((str, [p, val]) => {
      return `${str}${p}: ${val}\n`;
    }, '');
  }

  const finalString = "---\n" + objToString(data) +
    "---\n" + "\n" +
     "# " + data["Title"] +
    "\n";
  // console.log(finalString);
  return finalString;
}

function parseLibrary(file) {
  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {

      // Validating ISBN
      const isbn = data.ISBN.trim().replace(`="`, '').replace(`"`, '');

      // const bookObj = template.forEach(key => {
      //   // console.log(key, data[key]);
      //   new Object({ [key]: data[key] });
      // });

      // console.log(bookObj);

      const book = {
        Title: data.Title,
        Tag: 'book',
        Author: data.Author,
        ISBN: isbn,
        Pages: data["Number of Pages"],
        Bookshelves: data.Bookshelves ? data.Bookshelves : 'read',
        DateRead: (data["Date Read"] != null || '') ? formatDate(data["Date Read"]) : '',
        DateAdded: formatDate(data["Date Added"]),
        MyRating: data["My Rating"]
      }

      results.push(book);
    })

    .on('end', () => {

      const test = formatToMarkdown(template, results[0]);

      //console.log(formatToMarkdown(template, results[15]));

      results.forEach((book) => {

        const data = formatToMarkdown(template, book);

        fs.writeFile(`./files/${book.Title}.md`, data, function (error) {
          if (error) {
            console.log("Error: ", error);
          }

          console.log("File created.");
        });
      });

    });
}

parseLibrary(file);
