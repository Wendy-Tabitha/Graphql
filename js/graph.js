// Color palette for graph elements
export const COLORS = {
    darkBlue: '#22223b',
    blueGray: '#4a4e69',
    mauve: '#9a8c98',
    pinkBeige: '#c9ada7',
    offWhite: '#f2e9e4'
};

// Draw a line chart of cumulative XP over time
export function drawXpOverTimeGraph() {
    if (!window.userData || !window.userData.xpData) {
        console.error('XP data not loaded');
        return;
    }
    const transactions = window.userData.xpData;
    const svg = document.getElementById('graph-svg');
    const placeholder = document.getElementById('graph-placeholder');
    svg.style.display = 'block';
    placeholder.style.display = 'none';
    svg.innerHTML = '';
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const xpByMonth = {};
    let cumulativeXP = 0;
    sortedTransactions.forEach(t => {
        const date = new Date(t.createdAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!xpByMonth[monthKey]) {
            xpByMonth[monthKey] = { date: new Date(date.getFullYear(), date.getMonth(), 1), xp: 0, cumulativeXP: 0 };
        }
        xpByMonth[monthKey].xp += t.amount;
        cumulativeXP += t.amount;
        xpByMonth[monthKey].cumulativeXP = cumulativeXP / 1048576;
    });
    const dataPoints = Object.values(xpByMonth);
    const minDate = dataPoints.length > 0 ? dataPoints[0].date : new Date();
    const maxDate = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].date : new Date();
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxXP = dataPoints.length > 0 ? Math.max(...dataPoints.map(d => d.cumulativeXP)) : 0;
    const xScale = (date) => {
        const range = maxDate - minDate;
        const normalized = (date - minDate) / range;
        return margin.left + (normalized * graphWidth);
    };
    const yScale = (value) => {
        return margin.top + graphHeight - (value / maxXP * graphHeight);
    };
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(mainGroup);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', margin.top / 2);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', COLORS.darkBlue);
    title.textContent = 'Cumulative XP Over Time';
    mainGroup.appendChild(title);
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left);
    xAxis.setAttribute('y1', margin.top + graphHeight);
    xAxis.setAttribute('x2', margin.left + graphWidth);
    xAxis.setAttribute('y2', margin.top + graphHeight);
    xAxis.setAttribute('stroke', COLORS.darkBlue);
    xAxis.setAttribute('stroke-width', '2');
    mainGroup.appendChild(xAxis);
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left);
    yAxis.setAttribute('y1', margin.top);
    yAxis.setAttribute('x2', margin.left);
    yAxis.setAttribute('y2', margin.top + graphHeight);
    yAxis.setAttribute('stroke', COLORS.darkBlue);
    yAxis.setAttribute('stroke-width', '2');
    mainGroup.appendChild(yAxis);
    const monthDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
    const tickStep = Math.max(1, Math.ceil(monthDiff / 6));
    for (let m = 0; m <= monthDiff; m += tickStep) {
        const tickDate = new Date(minDate);
        tickDate.setMonth(tickDate.getMonth() + m);
        const x = xScale(tickDate);
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', x);
        tick.setAttribute('y1', margin.top + graphHeight);
        tick.setAttribute('x2', x);
        tick.setAttribute('y2', margin.top + graphHeight + 5);
        tick.setAttribute('stroke', COLORS.darkBlue);
        tick.setAttribute('stroke-width', '1');
        mainGroup.appendChild(tick);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', margin.top + graphHeight + 20);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', COLORS.darkBlue);
        label.textContent = `${tickDate.getMonth() + 1}/${tickDate.getFullYear()}`;
        mainGroup.appendChild(label);
    }
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
        const value = (maxXP / yTickCount) * i;
        const y = yScale(value);
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', margin.left - 5);
        tick.setAttribute('y1', y);
        tick.setAttribute('x2', margin.left);
        tick.setAttribute('y2', y);
        tick.setAttribute('stroke', COLORS.darkBlue);
        tick.setAttribute('stroke-width', '1');
        mainGroup.appendChild(tick);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', margin.left - 10);
        label.setAttribute('y', y + 4);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', COLORS.darkBlue);
        label.textContent = value.toFixed(2);
        mainGroup.appendChild(label);
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', margin.left);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', margin.left + graphWidth);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#e0e0e0');
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('stroke-dasharray', '4,4');
        mainGroup.appendChild(gridLine);
    }
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', margin.left + graphWidth / 2);
    xLabel.setAttribute('y', margin.top + graphHeight + 40);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('font-size', '14');
    xLabel.setAttribute('fill', COLORS.darkBlue);
    xLabel.textContent = 'Time';
    mainGroup.appendChild(xLabel);
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', margin.left - 40);
    yLabel.setAttribute('y', margin.top + graphHeight / 2);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('font-size', '14');
    yLabel.setAttribute('fill', COLORS.darkBlue);
    yLabel.setAttribute('transform', `rotate(-90, ${margin.left - 40}, ${margin.top + graphHeight / 2})`);
    yLabel.textContent = 'Cumulative XP (MB)';
    mainGroup.appendChild(yLabel);
    if (dataPoints.length > 1) {
        let pathD = '';
        dataPoints.forEach((point, i) => {
            const x = xScale(point.date);
            const y = yScale(point.cumulativeXP);
            if (i === 0) {
                pathD += `M ${x} ${y}`;
            } else {
                pathD += ` L ${x} ${y}`;
            }
        });
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', COLORS.mauve);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        mainGroup.appendChild(path);
        dataPoints.forEach((point, index) => {
            const x = xScale(point.date);
            const y = yScale(point.cumulativeXP);
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '0');
            circle.setAttribute('fill', COLORS.pinkBeige);
            circle.setAttribute('stroke', COLORS.darkBlue);
            circle.setAttribute('stroke-width', '2');
            const animateSize = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animateSize.setAttribute('attributeName', 'r');
            animateSize.setAttribute('from', '0');
            animateSize.setAttribute('to', '5');
            animateSize.setAttribute('dur', '0.5s');
            animateSize.setAttribute('begin', `${index * 0.1}s`);
            animateSize.setAttribute('fill', 'freeze');
            circle.appendChild(animateSize);
            circle.addEventListener('mouseover', function() {
                this.setAttribute('r', '7');
                const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                tooltip.setAttribute('id', 'tooltip');
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x + 10);
                rect.setAttribute('y', y - 30);
                rect.setAttribute('width', '160');
                rect.setAttribute('height', '50');
                rect.setAttribute('rx', '5');
                rect.setAttribute('fill', COLORS.offWhite);
                rect.setAttribute('stroke', COLORS.mauve);
                tooltip.appendChild(rect);
                const month = point.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text1.setAttribute('x', x + 20);
                text1.setAttribute('y', y - 10);
                text1.setAttribute('fill', COLORS.darkBlue);
                text1.textContent = `Month: ${month}`;
                tooltip.appendChild(text1);
                const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text2.setAttribute('x', x + 20);
                text2.setAttribute('y', y + 10);
                text2.setAttribute('fill', COLORS.darkBlue);
                text2.textContent = `XP: ${point.cumulativeXP.toFixed(2)} MB`;
                tooltip.appendChild(text2);
                mainGroup.appendChild(tooltip);
            });
            circle.addEventListener('mouseout', function() {
                this.setAttribute('r', '5');
                const tooltip = document.getElementById('tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
            mainGroup.appendChild(circle);
        });
    } else {
        const noData = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        noData.setAttribute('x', width / 2);
        noData.setAttribute('y', height / 2);
        noData.setAttribute('text-anchor', 'middle');
        noData.setAttribute('font-size', '16');
        noData.setAttribute('fill', COLORS.mauve);
        noData.textContent = 'No XP data available';
        mainGroup.appendChild(noData);
    }
}

// Draw a pie chart of pass/fail project ratio
export function drawPassFailRatioGraph() {
    if (!window.userData || !window.userData.gradesData) {
        console.error('Grades data not loaded');
        return;
    }
    const results = window.userData.gradesData.results;
    const svg = document.getElementById('graph-svg');
    const placeholder = document.getElementById('graph-placeholder');
    svg.style.display = 'block';
    placeholder.style.display = 'none';
    svg.innerHTML = '';
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    const radius = Math.min(graphWidth, graphHeight) / 2;
    const centerX = margin.left + graphWidth / 2;
    const centerY = margin.top + graphHeight / 2;
    const passCount = results.filter(r => r.grade > 0).length;
    const failCount = results.filter(r => r.grade === 0).length;
    const total = passCount + failCount;
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(mainGroup);
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', margin.top / 2);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', COLORS.darkBlue);
    title.textContent = 'Project Pass/Fail Ratio';
    mainGroup.appendChild(title);
    if (total > 0) {
        const passAngle = (passCount / total) * 360;
        const failAngle = (failCount / total) * 360;
        if (passCount > 0) {
            const passSegment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const passStartAngle = 0;
            const passEndAngle = passAngle;
            let passPath = describeArc(centerX, centerY, radius, passStartAngle, 0);
            passSegment.setAttribute('d', passPath);
            passSegment.setAttribute('fill', COLORS.blueGray);
            passSegment.setAttribute('stroke', 'white');
            passSegment.setAttribute('stroke-width', '2');
            mainGroup.appendChild(passSegment);
            const animatePath = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animatePath.setAttribute('attributeName', 'd');
            animatePath.setAttribute('from', passPath);
            animatePath.setAttribute('to', describeArc(centerX, centerY, radius, passStartAngle, passEndAngle));
            animatePath.setAttribute('dur', '1s');
            animatePath.setAttribute('fill', 'freeze');
            passSegment.appendChild(animatePath);
        }
        if (failCount > 0) {
            const failSegment = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const failStartAngle = passAngle;
            const failEndAngle = 360;
            let failPath = describeArc(centerX, centerY, radius, failStartAngle, failStartAngle);
            failSegment.setAttribute('d', failPath);
            failSegment.setAttribute('fill', COLORS.pinkBeige);
            failSegment.setAttribute('stroke', 'white');
            failSegment.setAttribute('stroke-width', '2');
            mainGroup.appendChild(failSegment);
            const animatePath = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animatePath.setAttribute('attributeName', 'd');
            animatePath.setAttribute('from', failPath);
            animatePath.setAttribute('to', describeArc(centerX, centerY, radius, failStartAngle, failEndAngle));
            animatePath.setAttribute('dur', '1s');
            animatePath.setAttribute('begin', '0.5s');
            animatePath.setAttribute('fill', 'freeze');
            failSegment.appendChild(animatePath);
        }
        const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mainGroup.appendChild(legendGroup);
        const passRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        passRect.setAttribute('x', centerX + radius + 20);
        passRect.setAttribute('y', centerY - 40);
        passRect.setAttribute('width', '20');
        passRect.setAttribute('height', '20');
        passRect.setAttribute('fill', COLORS.blueGray);
        legendGroup.appendChild(passRect);
        const passText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        passText.setAttribute('x', centerX + radius + 50);
        passText.setAttribute('y', centerY - 25);
        passText.setAttribute('fill', COLORS.darkBlue);
        passText.textContent = `Pass: ${passCount} (${(passCount / total * 100).toFixed(1)}%)`;
        legendGroup.appendChild(passText);
        const failRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        failRect.setAttribute('x', centerX + radius + 20);
        failRect.setAttribute('y', centerY - 10);
        failRect.setAttribute('width', '20');
        failRect.setAttribute('height', '20');
        failRect.setAttribute('fill', COLORS.pinkBeige);
        legendGroup.appendChild(failRect);
        const failText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        failText.setAttribute('x', centerX + radius + 50);
        failText.setAttribute('y', centerY + 5);
        failText.setAttribute('fill', COLORS.darkBlue);
        failText.textContent = `Fail: ${failCount} (${(failCount / total * 100).toFixed(1)}%)`;
        legendGroup.appendChild(failText);
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', centerX);
        centerText.setAttribute('y', centerY + 5);
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('font-size', '16');
        centerText.setAttribute('font-weight', 'bold');
        centerText.setAttribute('fill', COLORS.darkBlue);
        centerText.textContent = '0 Projects';
        mainGroup.appendChild(centerText);
        let count = 0;
        const interval = setInterval(() => {
            count = Math.min(count + Math.ceil(total / 20), total);
            centerText.textContent = `${count} Projects`;
            if (count >= total) {
                clearInterval(interval);
            }
        }, 50);
        mainGroup.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX - svg.getBoundingClientRect().left;
            const mouseY = e.clientY - svg.getBoundingClientRect().top;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= radius) {
                let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                if (angle < 0) angle += 360;
                angle = (angle + 90) % 360;
                let hoveredSegment;
                if (angle <= passAngle) {
                    hoveredSegment = 'pass';
                } else {
                    hoveredSegment = 'fail';
                }
                const existingTooltip = document.getElementById('pie-tooltip');
                if (existingTooltip) {
                    existingTooltip.remove();
                }
                const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                tooltip.setAttribute('id', 'pie-tooltip');
                const tipText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                tipText.setAttribute('x', mouseX + 15);
                tipText.setAttribute('y', mouseY);
                tipText.setAttribute('fill', COLORS.darkBlue);
                tipText.setAttribute('font-weight', 'bold');
                if (hoveredSegment === 'pass') {
                    tipText.textContent = `Passed: ${passCount} projects`;
                } else {
                    tipText.textContent = `Failed: ${failCount} projects`;
                }
                const tipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const textLength = tipText.getComputedTextLength() || 150;
                tipBg.setAttribute('x', mouseX + 10);
                tipBg.setAttribute('y', mouseY - 15);
                tipBg.setAttribute('width', textLength + 10);
                tipBg.setAttribute('height', '20');
                tipBg.setAttribute('fill', COLORS.offWhite);
                tipBg.setAttribute('opacity', '0.9');
                tipBg.setAttribute('rx', '3');
                tooltip.appendChild(tipBg);
                tooltip.appendChild(tipText);
                mainGroup.appendChild(tooltip);
            } else {
                const existingTooltip = document.getElementById('pie-tooltip');
                if (existingTooltip) {
                    existingTooltip.remove();
                }
            }
        });
        svg.addEventListener('mouseleave', () => {
            const existingTooltip = document.getElementById('pie-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
        });
    } else {
        const noData = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        noData.setAttribute('x', width / 2);
        noData.setAttribute('y', height / 2);
        noData.setAttribute('text-anchor', 'middle');
        noData.setAttribute('font-size', '16');
        noData.setAttribute('fill', COLORS.mauve);
        noData.textContent = 'No project data available';
        mainGroup.appendChild(noData);
    }
}

// Create an SVG arc path for a pie chart segment
export function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    if (endAngle - startAngle >= 359.99) {
        const mid1 = polarToCartesian(x, y, radius, startAngle + 90);
        const mid2 = polarToCartesian(x, y, radius, startAngle + 180);
        const mid3 = polarToCartesian(x, y, radius, startAngle + 270);
        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, 0, 1, mid1.x, mid1.y,
            "A", radius, radius, 0, 0, 1, mid2.x, mid2.y,
            "A", radius, radius, 0, 0, 1, mid3.x, mid3.y,
            "A", radius, radius, 0, 0, 1, start.x, start.y,
            "Z"
        ].join(" ");
    }
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

// Convert polar coordinates to cartesian coordinates for SVG
export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Set up event listeners for graph buttons to switch between graphs
export function setupGraphButtons() {
    const xpTimeBtn = document.getElementById('xp-time-btn');
    const passFailBtn = document.getElementById('pass-fail-btn');
    if (xpTimeBtn) {
        xpTimeBtn.addEventListener('click', () => {
            drawXpOverTimeGraph();
        });
    }
    if (passFailBtn) {
        passFailBtn.addEventListener('click', () => {
            drawPassFailRatioGraph();
        });
    }
} 