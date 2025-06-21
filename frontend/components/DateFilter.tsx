"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedOption, setSelectedOption] = useState(
    searchParams.get("dateRange") || "all"
  );
  const [fromDate, setFromDate] = useState(searchParams.get("from") || "");
  const [toDate, setToDate] = useState(searchParams.get("to") || "");

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");

    if (value === "all") {
      params.delete("dateRange");
    } else {
      params.set("dateRange", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSpecificDateChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (fromDate) {
      params.set("from", fromDate);
    } else {
      params.delete("from");
    }
    if (toDate) {
      params.set("to", toDate);
    } else {
      params.delete("to");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // If user selects specific dates, then clicks a radio button, then clicks back to specific, we need to re-apply the from/to
    if (selectedOption === "specific") {
      handleSpecificDateChange();
    }
  }, [fromDate, toDate, selectedOption]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-semibold text-lg mb-3">DATE RANGE</h3>
      <div className="space-y-2">
        <div>
          <input
            type="radio"
            id="all"
            name="dateFilter"
            value="all"
            checked={selectedOption === "all"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="all">All</label>
        </div>
        <div>
          <input
            type="radio"
            id="24h"
            name="dateFilter"
            value="24h"
            checked={selectedOption === "24h"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="24h">Past 24 Hours</label>
        </div>
        <div>
          <input
            type="radio"
            id="7d"
            name="dateFilter"
            value="7d"
            checked={selectedOption === "7d"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="7d">Past 7 Days</label>
        </div>
        <div>
          <input
            type="radio"
            id="30d"
            name="dateFilter"
            value="30d"
            checked={selectedOption === "30d"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="30d">Past 30 Days</label>
        </div>
        <div>
          <input
            type="radio"
            id="12m"
            name="dateFilter"
            value="12m"
            checked={selectedOption === "12m"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="12m">Past 12 Months</label>
        </div>
        <div>
          <input
            type="radio"
            id="specific"
            name="dateFilter"
            value="specific"
            checked={selectedOption === "specific"}
            onChange={handleOptionChange}
            className="mr-2"
          />
          <label htmlFor="specific">Specific Dates</label>
        </div>
        {selectedOption === "specific" && (
          <div className="pl-6 pt-2 space-y-2">
            <div>
              <label
                htmlFor="from-date"
                className="block text-sm font-medium text-gray-700"
              >
                From
              </label>
              <input
                type="date"
                id="from-date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="to-date"
                className="block text-sm font-medium text-gray-700"
              >
                To
              </label>
              <input
                type="date"
                id="to-date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilter;
