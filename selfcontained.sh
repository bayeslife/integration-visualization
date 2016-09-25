rm -f selfcontained.html

cat src/html/index.part1.html > selfcontained.html && cat build/data.json >> selfcontained.html && cat src/lib/d3.v3.min.js >> selfcontained.html && cat src/lib/bihisankey.js  >> selfcontained.html && cat src/lib/app.js >> selfcontained.html  && cat src/html/index.part2.html >> selfcontained.html
