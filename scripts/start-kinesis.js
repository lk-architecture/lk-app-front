import kinesalite from "kinesalite";

kinesalite({createTableMs: 50})
    .listen(4567, async err => {
        if (err) {
            console.log("Error starting kinesalite server");
            console.log(err.stack);
            process.exit(1);
            return;
        }
        console.log("kinesalite started on http://localhost:4567");
    });
