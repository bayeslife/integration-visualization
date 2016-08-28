# Presentation of integration connectivity via a sankey diagram

## Run

```
node transformer <metadata file>
```

e.g.
```
node transformer complex.json
```

This will produce a data.json file.

Then open the index.html which will display the result


<script src="d3.v3.min.js"></script>
<script src="bihisankey.js"></script>
<script src="data.json"></script>
<script src="app.js"></script>
