import React from 'react'

const Paginate = ({
	postsPerPage,
	totalPosts,
	currentPage,
	paginate,
	previousPage,
	nextPage,
}) => {
	const pageNumbers = [];

	for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
		pageNumbers.push(i);
	}
	return (
		<div className="pagination-container">
			<ul className="pagination">
				<li onClick={previousPage} className="page-number">
					Prev
				</li>
				{pageNumbers.map((number) => (
					<li
						key={number}
						onClick={() => paginate(number)}
						className={
							'page-number ' + (number === currentPage ? 'active' : '')
						}
					>
						{number}
					</li>
				))}
				<li onClick={nextPage} className="page-number">
					Next
				</li>
			</ul>
		</div>
	);
};

export default Paginate;



// import React, { useState, useEffect } from 'react'
// import { DateRangePicker } from 'react-date-range';
// import 'react-date-range/dist/styles.css'; // import the styles
// import 'react-date-range/dist/theme/default.css'; // import the theme

// const Example = () => {
//   const [dateRange, setDateRange] = useState({
//     startDate: new Date(),
//     endDate: new Date(),
//     key: 'selection'
//   });
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     setFilteredData(data.filter(item => {
//       const itemDate = new Date(item.date);
//       return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
//     }));
//   }, [dateRange, data]);

//   return (
//     <div>
//       <DateRangePicker
//         ranges={[dateRange]}
//         onChange={(ranges) => setDateRange(ranges.selection)}
//       />
//       <table>
//         <tbody>
//           {filteredData.map(item => (
//             <tr key={item.id}>
//               <td>{item.name}</td>
//               <td>{item.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default Example


 




