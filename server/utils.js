function formatDate(date) {
    let result = '';

    const objDate = new Date(date);
    // console.log(date, objDate);

    if (objDate == 'Invalid Date') {
        return result;
    } else {
        const formatedDate = `${objDate.getFullYear()}-${objDate.getMonth()}-${objDate.getDate()}`;

        result = formatedDate;
        return result;
    }
}

module.exports = {
    formatDate
}
