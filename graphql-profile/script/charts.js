// SVG Chart Generation Functions

// Line chart for XP progress
function createXPProgressChart(data, containerId) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    const padding = 40;

    // Calculate scales
    const xScale = (width - padding * 2) / (data.length - 1);
    const yMax = Math.max(...data.map(d => d.amount));
    const yScale = (height - padding * 2) / yMax;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const points = data.map((d, i) => {
        const x = padding + i * xScale;
        const y = height - padding - d.amount * yScale;
        return `${x},${y}`;
    }).join(' ');

    path.setAttribute('d', `M ${points}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#4f46e5');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    // Add animation
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.animation = 'dash 1.5s ease-in-out forwards';

    svg.appendChild(path);
    container.appendChild(svg);
}

// Pie chart for project success rate
function createSuccessRateChart(data, containerId) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 20;

    // Calculate percentages
    const total = data.passed + data.failed;
    const passedPercentage = (data.passed / total) * 100;
    const failedPercentage = (data.failed / total) * 100;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create pie segments
    const createArc = (startAngle, endAngle) => {
        const start = polarToCartesian(width/2, height/2, radius, endAngle);
        const end = polarToCartesian(width/2, height/2, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return [
            'M', width/2, height/2,
            'L', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            'Z'
        ].join(' ');
    };

    // Passed segment
    const passedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    passedPath.setAttribute('d', createArc(0, (passedPercentage / 100) * 360));
    passedPath.setAttribute('fill', '#10b981');
    passedPath.style.opacity = '0';
    passedPath.style.animation = 'fadeIn 0.5s ease-in-out forwards';

    // Failed segment
    const failedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    failedPath.setAttribute('d', createArc((passedPercentage / 100) * 360, 360));
    failedPath.setAttribute('fill', '#ef4444');
    failedPath.style.opacity = '0';
    failedPath.style.animation = 'fadeIn 0.5s ease-in-out 0.5s forwards';

    svg.appendChild(passedPath);
    svg.appendChild(failedPath);
    container.appendChild(svg);
}

// Bar chart for audit history
function createAuditHistoryChart(data, containerId) {
    const container = document.getElementById(containerId);
    const width = container.clientWidth;
    const height = container.clientHeight;
    const padding = 40;

    // Group audits by date
    const groupedData = data.reduce((acc, audit) => {
        const date = audit.date.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dates = Object.keys(groupedData);
    const counts = Object.values(groupedData);

    // Calculate scales
    const xScale = (width - padding * 2) / dates.length;
    const yMax = Math.max(...counts);
    const yScale = (height - padding * 2) / yMax;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create bars
    dates.forEach((date, i) => {
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const x = padding + i * xScale;
        const y = height - padding - counts[i] * yScale;
        const barWidth = xScale * 0.8;
        const barHeight = counts[i] * yScale;

        bar.setAttribute('x', x);
        bar.setAttribute('y', height - padding);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', '0');
        bar.setAttribute('fill', '#4f46e5');
        bar.style.animation = `growBar 0.5s ease-out ${i * 0.1}s forwards`;

        svg.appendChild(bar);
    });

    container.appendChild(svg);
}

// Helper function for polar to cartesian coordinates
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes dash {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    @keyframes growBar {
        to {
            height: var(--bar-height);
            y: var(--bar-y);
        }
    }
`;
document.head.appendChild(style);

// Export functions
window.charts = {
    createXPProgressChart,
    createSuccessRateChart,
    createAuditHistoryChart
}; 