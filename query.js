import { queryClient } from "./aws-clients.js";
import { QueryCommand } from "@aws-sdk/client-timestream-query";
import { DATABASE_NAME, TABLE_NAME } from "./constants.js";

const SELECT_ALL_QUERY =
  "SELECT * FROM " + DATABASE_NAME + "." + TABLE_NAME + " LIMIT 10";

async function runQuery1() {
  console.log(SELECT_ALL_QUERY);
  const queryResponse = await getAllRows(SELECT_ALL_QUERY, null);
  return queryResponse;
}

async function getAllRows(query, nextToken) {
  const params = {
    QueryString: query,
  };

  if (nextToken) {
    params.NextToken = nextToken;
  }
  const queryCommand = new QueryCommand(params);
  const response = await queryClient.send(queryCommand);
  // console.log(response);
  const parsedResponse = parseQueryResult(response);
  return parsedResponse;
  // await queryClient.send(queryCommand).then(
  //   (response) => {
  //     //TODO: parse the response
  //     // parseQueryResult(response);
  //     console.log(response);

  //     // if (response.NextToken) {
  //     //   getAllRows(query, response.NextToken);
  //     // }
  //     return response;
  //   },
  //   (err) => {
  //     console.error("Error while querying:", err);
  //   }
  // );
}

async function tryQueryWithMultiplePages(limit) {
  const queryWithLimits = SELECT_ALL_QUERY + " LIMIT " + limit;
  console.log(`Running query with multiple pages: ${queryWithLimits}`);
  await getAllRows(queryWithLimits, null);
}

async function tryCancelQuery() {
  const params = {
    QueryString: SELECT_ALL_QUERY,
  };
  console.log(`Running query: ${SELECT_ALL_QUERY}`);

  await queryClient
    .query(params)
    .promise()
    .then(
      async (response) => {
        await cancelQuery(response.QueryId);
      },
      (err) => {
        console.error("Error while executing select all query:", err);
      }
    );
}

async function cancelQuery(queryId) {
  const cancelParams = {
    QueryId: queryId,
  };
  console.log(`Sending cancellation for query: ${SELECT_ALL_QUERY}`);
  await queryClient
    .cancelQuery(cancelParams)
    .promise()
    .then(
      (response) => {
        console.log("Query has been cancelled successfully");
      },
      (err) => {
        console.error("Error while cancelling select all:", err);
      }
    );
}

function parseQueryResult(response) {
  const columnInfo = response.ColumnInfo;
  const rows = response.Rows;
  const parsedRows = [];

  rows.forEach(function (row) {
    parsedRows.push(parseRow(columnInfo, row));
  });

  return { data: parsedRows, metadata: columnInfo };
}

function parseRow(columnInfo, row) {
  const data = row.Data;
  const rowOutput = {};

  var i;
  for (i = 0; i < data.length; i++) {
    const info = columnInfo[i];
    const datum = data[i];
    // rowOutput.push(parseDatum(info, datum));
    rowOutput[info.Name] = datum.ScalarValue;
  }
  // console.log(rowOutput);
  return rowOutput;
}

function parseDatum(info, datum) {
  if (datum.NullValue != null && datum.NullValue === true) {
    return NULL;
  }

  const columnType = info.Type;

  // If the column is of TimeSeries Type
  if (columnType.TimeSeriesMeasureValueColumnInfo != null) {
    return parseTimeSeries(info, datum);
  }
  // If the column is of Array Type
  else if (columnType.ArrayColumnInfo != null) {
    const arrayValues = datum.ArrayValue;
    return `${info.Name}=${parseArray(info.Type.ArrayColumnInfo, arrayValues)}`;
  }
  // If the column is of Row Type
  else if (columnType.RowColumnInfo != null) {
    const rowColumnInfo = info.Type.RowColumnInfo;
    const rowValues = datum.RowValue;
    return parseRow(rowColumnInfo, rowValues);
  }
  // If the column is of Scalar Type
  else {
    return parseScalarType(info, datum);
  }
}

function parseTimeSeries(info, datum) {
  const timeSeriesOutput = [];
  datum.TimeSeriesValue.forEach(function (dataPoint) {
    timeSeriesOutput.push(
      `{time=${dataPoint.Time}, value=${parseDatum(
        info.Type.TimeSeriesMeasureValueColumnInfo,
        dataPoint.Value
      )}}`
    );
  });

  return `[${timeSeriesOutput.join(", ")}]`;
}

function parseScalarType(info, datum) {
  return parseColumnName(info) + datum.ScalarValue;
}

function parseColumnName(info) {
  return info.Name == null ? "" : `${info.Name}=`;
}

function parseArray(arrayColumnInfo, arrayValues) {
  const arrayOutput = [];
  arrayValues.forEach(function (datum) {
    arrayOutput.push(parseDatum(arrayColumnInfo, datum));
  });
  return `[${arrayOutput.join(", ")}]`;
}

export { runQuery1, tryCancelQuery, tryQueryWithMultiplePages, getAllRows };
