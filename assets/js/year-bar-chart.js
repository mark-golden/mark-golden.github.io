(function () {
  function parseYearCounts(container) {
    var data = [];
    var headings = container.querySelectorAll('h2');

    headings.forEach(function (h2) {
      var year = h2.textContent.trim();
      if (!/^\d{4}$/.test(year)) {
        return;
      }

      var count = 0;
      var sib = h2.nextElementSibling;
      while (sib && sib.tagName !== 'H2') {
        if (sib.tagName === 'UL' || sib.tagName === 'OL') {
          count += sib.children.length;
        } else if (sib.classList && sib.classList.contains('list__item')) {
          count += 1;
        }
        sib = sib.nextElementSibling;
      }

      data.push({ year: year, count: count });
    });

    return data;
  }

  function renderChart(target, data) {
    if (!data.length) {
      return;
    }

    var ordered = data.slice().reverse();
    var max = Math.max.apply(null, ordered.map(function (d) { return d.count; }));

    var html = '<div class="year-bar-chart">';
    ordered.forEach(function (d) {
      var pct = max ? Math.round((d.count / max) * 100) : 0;
      html +=
        '<div class="year-bar-chart__col">' +
          '<div class="year-bar-chart__count">' + d.count + '</div>' +
          '<div class="year-bar-chart__bar" style="height:' + pct + '%"></div>' +
          '<div class="year-bar-chart__label">' + d.year + '</div>' +
        '</div>';
    });
    html += '</div>';

    target.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-year-chart-source]').forEach(function (target) {
      var source = document.querySelector(target.getAttribute('data-year-chart-source'));
      if (!source) {
        return;
      }
      renderChart(target, parseYearCounts(source));
    });
  });
})();
