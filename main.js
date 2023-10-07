const inputForm = document.getElementById("form")
inputForm.addEventListener("submit", handleSubmit)
let username = ""
const api_url = "https://codeforces.com/api/"
let verdict = {}
let language = {}
let level = {}
let ratings = {}
let tags = {}
let tried = new Set();
let solved = new Set();
let attempts = new Map();
let max_attempts = 0;
let max_attempted_problem = "";
let problems_solved_count = {};
let max_ac = 0;
let max_ac_problem_name = "";
let heatmap = {};


async function handleSubmit(e) {
    try {
        e.preventDefault();
        const inputBox = document.getElementById("input-box");
        username = inputBox.value;

        let response = await fetch(`${api_url}user.status?handle=${username}`);
        response = await response.json();

        console.log(response);
        for (let i = 0; i < response.result.length; i++) {
            // taking one submission into a variable
            const submission = response.result[i];
            if (verdict[submission.verdict] === undefined) {
                verdict[submission.verdict] = 1;
            } else {
                verdict[submission.verdict]++;
            }

            //  calculate language
            if (language[submission.programmingLanguage] === undefined) {
                language[submission.programmingLanguage] = 1;
            } else {
                language[submission.programmingLanguage]++;
            }
            //  calculate rating 
            if (ratings[submission.problem.rating] === undefined) {
                ratings[submission.problem.rating] = 1;
            } else {
                ratings[submission.problem.rating]++;
            }
            let contestId = submission.problem.contestId;
            let level = submission.problem.index;
            let name = submission.problem.name;
            let key = `${contestId}-${name}-${level}`;
            // tried problem
            tried.add(key);

            if (submission.verdict === "OK") {
                solved.add(key);
            }
            if (attempts[key] === undefined) {
                attempts[key] = 1;
            } else {
                attempts[key] += 1;
            }

            if (attempts[key] > max_attempts) {
                max_attempted_problem = name;
                max_attempts = attempts[key];
            }
            if (submission.verdict == "OK") {
                if (problems_solved_count[key] === undefined) {
                    problems_solved_count[key] = 1;
                } else {
                    problems_solved_count[key] += 1;
                }
            }
            if (problems_solved_count[key] > max_ac) {
                max_ac = problems_solved_count[key];
                max_ac_problem_name = `${contestId}-${level}`;
            }
            // heat map cal
            const submissionTimeMs = submission.creationTimeSeconds * 1000
            const submissionDate = new Date(submissionTimeMs)
            submissionDate.setHours(0,0,0,0)
        
            if(heatmap[submissionDate.valueOf()]=== undefined)
            {
                heatmap[submissionDate.valueOf()] = 1;
            }else{
                heatmap[submissionDate.valueOf()] += 1;
            }





        }

        console.log(language);
        console.log(verdict);
        console.log(ratings);




        drawVerdictChart();
        drawLanguageChart();
        drawRatingChart();
        drawContestStatsTable();
    }
    catch (err) {
        console.log(err);
    }
}

function drawheatMap() {
    const heapMapDiv = document.getElementById("heatmap")
    const heatmapTable = []
    for( const d in heatmap)
    {
        
    }
        heatmapTable.push({type: "date", id: "Date"})
 
}






function drawContestStatsTable() {
    let contest_stats_div = document.getElementById("contest-stats")
    const usernameTh = document.getElementById("username")
    usernameTh.innerHTML = username
    contest_stats_div.style.display = "flex"

    // contest_stats_div.classList.remove("d-none")
    let contest_status_tbody = document.getElementById("contest-stats-table-body")
    let total_attempts = 0
    for (i in attempts) {
        total_attempts += attempts[i]
    }
    let average_attempt = total_attempts / tried.size

    let problems_with_one_submission = 0;
    let all_accepted_submission_count = 0;
    for (let i in problems_solved_count) {
        if (problems_solved_count[i] === 1) {
            problems_with_one_submission += 1;
        }
        all_accepted_submission_count += problems_solved_count[i];
    }
    // const ans = Object.values(problems_solved_count).reduce((currentsum,value) => (currentsum += value));
    const problem_with_one_ac_sub_per = problems_with_one_submission / all_accepted_submission_count
    contest_status_tbody.innerHTML = `
    <tr>
            <td>Tried</td>
            <td>${tried.size}</td>
    </tr>
    <tr>
            <td>Solved</td>
            <td>${solved.size}</td>
    </tr>    
    <tr>
            <td> Average Attempts</td>
            <td>${average_attempt.toFixed(2)}</td>
    </tr>
        <tr>
        <td>Max attempts </td>
        <td>${max_attempts} (${max_attempted_problem})</td>
    </tr>
    <tr>
            <td>Solved with one Submission</td>
            <td>${problems_with_one_submission} (${problem_with_one_ac_sub_per.toFixed(2)}%)</td>
    </tr>
    <tr>
            <td>Max AC(s)</td>
            <td>${max_ac} (${max_ac_problem_name})</td>
    </tr>
   `;

}
function drawVerdictChart() {

    const verdictDiv = document.getElementById("verdict-chart");

    // verdictDiv.classList.remove("d-none");
    // verdictDiv.classList.add("card");
    var verTable = [["Verdict", "Count"]];
    var verSliceColors = [];
    // beautiful names for the verdicts + colors


    for (var ver in verdict) {
        if (ver == "OK") {
            verTable.push(["AC", verdict[ver]]);
            verSliceColors.push({ color: "#FFC3A0" });
        } else if (ver == "WRONG_ANSWER") {
            verTable.push(["WA", verdict[ver]]);
            verSliceColors.push({ color: "#FF677D" });
        } else if (ver == "TIME_LIMIT_EXCEEDED") {
            verTable.push(["TLE", verdict[ver]]);
            verSliceColors.push({ color: "#D4A5A5" });
        } else if (ver == "MEMORY_LIMIT_EXCEEDED") {
            verTable.push(["MLE", verdict[ver]]);
            verSliceColors.push({ color: "#392F5A" });
        } else if (ver == "RUNTIME_ERROR") {
            verTable.push(["RTE", verdict[ver]]);
            verSliceColors.push({ color: "#31A2AC" });
        } else if (ver == "COMPILATION_ERROR") {
            verTable.push(["CPE", verdict[ver]]);
            verSliceColors.push({ color: "#61C0BF" });
        } else if (ver == "SKIPPED") {
            verTable.push(["SKIPPED", verdict[ver]]);
            verSliceColors.push({ color: "#6B4226" });
        } else if (ver == "CLALLENGED") {
            verTable.push(["CLALLENGED", verdict[ver]]);
            verSliceColors.push({ color: "#D9BF77" });
        } else {
            verTable.push([ver, verdict[ver]]);
            verSliceColors.push({});
        }
    }
    verdict = new google.visualization.arrayToDataTable(verTable);
    var verOptions = {
        height: 300,
        width: 300,

        title: "Verdict of " + username,
        legend: "none",
        pieSliceText: "label",
        slices: verSliceColors,
        fontName: "monospace",
        backgroundColor: "white",
        titleTextStyle: { color: "#212529", fontSize: "16" },
        legend: {
            textStyle: {
                color: "#212529",
            },
        },
        is3D: true,
    };


    var verChart = new google.visualization.PieChart(verdictDiv);
    verChart.draw(verdict, verOptions);
}

function drawLanguageChart() {
    const langDiv = document.getElementById("language-chart");


    const langData = [["language", "count"]]

    for (let lang in language) {
        langData.push([lang, language[lang]])
    }

    // console.log("LANG DATA ARRAY", langData)
    language = new google.visualization.arrayToDataTable(langData)

    const languageChartOptions = {
        // height: langDiv.getBoundingClientRect().width,
        height: 300,
        width: 300,
        title: `Language of ${username} `,
        pieSliceText: "label",
        fontName: "monospace",
        backgroundColor: "white",
        is3D: true
    };
    const langChart = new google.visualization.PieChart(langDiv);
    langChart.draw(language, languageChartOptions);
}
function drawRatingChart() {
    const ratingDiv = document.getElementById("ratings-chart")

    const ratingTable = []

    for (let rating in ratings) {
        ratingTable.push([rating, ratings[rating]])
    }

    ratings = new google.visualization.DataTable()
    ratings.addColumn("string", "Rating")
    ratings.addColumn("number", "solved")
    ratings.addRows(ratingTable)

    const ratingChartOptions = {
        width: 500,
        height: 500,
        title: `problem ratings of ${username} `,
        fontName: "monospace",
    };
    const ratingChart = new google.visualization.ColumnChart(ratingDiv);
    ratingChart.draw(ratings, ratingChartOptions);

}