/* eslint-disable no-throw-literal */
import { useEffect, useState } from 'react';
import { SPREAD, BACK, PAGE_INDEX, FORWARD } from 'constants/pagination';

const elementPage = (page) => ({ value: page, type: PAGE_INDEX });
const spreadPage = (direction) => ({ value: direction, type: SPREAD });

function createInnerSpread(start, end) {
  const spread = [];
  while (start < end + 1) {
    spread.push(elementPage(start));
    start++;
  }
  return spread;
}

export function usePagination({ currentPage, pages, spreadSize = 7, setPage }) {
  const [pagination, setPagination] = useState([]);
  const [innerSpreadStart, setInnerSpreadStart] = useState(1);
  const [backSpread, setBackSpread] = useState(false);
  const [forwardSpread, setForwardSpread] = useState(false);
  const lastPage = pages.length - 1;
  const innerSpreadLength = Math.ceil(spreadSize / 2);

  function determineInnerSpreadStart(start = 1) {
    const innerSpreadEnd = start + innerSpreadLength - 1;
    if (innerSpreadEnd < currentPage) determineInnerSpreadStart(innerSpreadEnd + 1);
    else {
      const newInnerStart =
        innerSpreadEnd < lastPage ? start : lastPage - innerSpreadLength;
      setInnerSpreadStart(newInnerStart);
    }
  }

  function determineSpreads() {
    const needForwardSpread = innerSpreadStart + innerSpreadLength < lastPage;
    const needBackSpread = innerSpreadStart > 1;
    setForwardSpread(needForwardSpread);
    setBackSpread(needBackSpread);
  }

  function buildPagination() {
    const innerPages = [elementPage(0)];
    const innerSpreadEnd = innerSpreadStart + innerSpreadLength - 1;

    if (backSpread) innerPages.push(spreadPage(BACK));
    innerPages.push(...createInnerSpread(innerSpreadStart, innerSpreadEnd));
    if (forwardSpread) innerPages.push(spreadPage(FORWARD));
    if (innerSpreadEnd < lastPage) innerPages.push(elementPage(lastPage));
    setPagination(innerPages);
  }

  function onPageSelect(value, type) {
    return () => {
      if (type === PAGE_INDEX) return setPage(value);
      if (value === FORWARD) return setPage(innerSpreadStart + innerSpreadLength);

      const needBackSpread = innerSpreadStart - innerSpreadLength - 1 > 1;
      if (needBackSpread) {
        setInnerSpreadStart(innerSpreadStart - innerSpreadLength - 1);
        setPage(innerSpreadStart - innerSpreadLength - 1);
      } else {
        setInnerSpreadStart(2);
        setPage(0);
      }
      return;
    };
  }

  useEffect(() => {
    const pageWithinSpread = !(
      innerSpreadStart <= currentPage &&
      currentPage < innerSpreadStart + innerSpreadLength
    );
    if (pageWithinSpread) determineInnerSpreadStart();
  }, [currentPage]);
  useEffect(() => determineSpreads(), [innerSpreadStart]);
  useEffect(() => buildPagination(), [backSpread, forwardSpread]);

  return [pagination, onPageSelect];
}
