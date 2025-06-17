// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// interface User {
//   userId: string;
//   address: string;
//   balance?: string | number; // String for errors/loading
// }

// export default function Home() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [loadingBalances, setLoadingBalances] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         // ✅ Step 1: Fetch all users
//         const res = await axios.get("/api/get-users");
//         let fetchedUsers = res.data.users.map((user: any) => ({
//           userId: user.userId,
//           address: user.address,
//           balance: "Loading...", // Placeholder for balance
//         }));

//         // ✅ Step 2: Move `00001` to the end of the list
//         // fetchedUsers = fetchedUsers.sort((a, b) => (a.userId === "00001" ? 1 : -1));
//         // Assuming the type of each user in the array
//         interface User {
//           userId: string;
//           // Add other properties as needed
//         }

//         // Modified sort function with type annotations
//         fetchedUsers = fetchedUsers.sort((a: User, b: User) =>
//           a.userId === "00001" ? 1 : -1
//         );

//         setUsers(fetchedUsers);
//         setLoadingUsers(false); // ✅ Users loaded, now fetch balances

//         // ✅ Step 3: Fetch balances and transfer/withdraw if necessary
//         fetchBalancesAndProcess(fetchedUsers);
//       } catch (err: any) {
//         console.error("Error fetching users:", err);
//         setError("Failed to load users.");
//         setLoadingUsers(false);
//       }
//     }

//     async function fetchBalancesAndProcess(usersList: User[]) {
//       for (let i = 0; i < usersList.length; i++) {
//         await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay per user

//         try {
//           const balanceRes = await axios.post("/api/get-balance", {
//             userId: usersList[i].userId,
//             coinId: 1280, // Default Coin ID (USDT)
//           });

//           const balance = parseFloat(
//             balanceRes.data?.data?.asset?.available || "0"
//           ); // ✅ Extract balance and convert to number

//           // ✅ Update UI with fetched balance
//           setUsers((prevUsers) =>
//             prevUsers.map((user) =>
//               user.userId === usersList[i].userId ? { ...user, balance } : user
//             )
//           );

//           // ✅ Step 4: If user `00001` has balance > 10, initiate withdrawal
//           if (usersList[i].userId === "00001" && balance > 10) {
//             console.log(
//               `Withdrawing ${balance} USDT from "00001" to external wallet...`
//             );

//             await axios.post("/api/auto-withdraw", {
//               userId: "00001",
//               coinId: 1280,
//               // address: "0x8eb2c8fa850f2d68e5ce8cf4842647b0561d34b5",
//               address: "0x5fbcf1a5d3eade2cece981af9a0c528de38af7de",
//               chain: "BSC",
//             });

//             console.log(`Withdrawal successful for "00001"`);
//           }

//           // ✅ Step 5: If another user has balance > 0, transfer to "00001"
//           if (usersList[i].userId !== "00001" && balance > 0) {
//             console.log(
//               `Transferring ${balance} USDT from ${usersList[i].userId} to "00001"...`
//             );

//             await axios.post("/api/auto-transfer", {
//               fromUserId: usersList[i].userId,
//               toUserId: "00001",
//               coinId: 1280,
//             });

//             console.log(
//               `Transfer successful from ${usersList[i].userId} to "00001"`
//             );
//           }
//         } catch (err) {
//           console.error(
//             `Error fetching balance for ${usersList[i].userId}:`,
//             err
//           );
//           setUsers((prevUsers) =>
//             prevUsers.map((user) =>
//               user.userId === usersList[i].userId
//                 ? { ...user, balance: "Error fetching balance" }
//                 : user
//             )
//           );
//         }
//       }
//       setLoadingBalances(false); // ✅ Balances fully loaded
//     }

//     fetchUsers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
//       <h1 className="text-4xl font-bold mb-8 text-[#333333]">
//         User Balances & Auto-Processing
//       </h1>

//       {loadingUsers && <p className="text-gray-600">Loading users...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loadingUsers && users.length === 0 && (
//         <p className="text-gray-600">No users found.</p>
//       )}

//       {!loadingUsers && users.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-300 px-4 py-2">User ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Address</th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   Balance (USDT)
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr
//                   key={user.userId}
//                   className={`hover:bg-gray-100 ${
//                     user.userId === "00001" ? "bg-yellow-100 font-bold" : ""
//                   }`}
//                 >
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.userId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.address}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.balance === "Loading..." ? (
//                       <span className="text-blue-500 animate-pulse">
//                         Loading...
//                       </span>
//                     ) : user.balance === "Error fetching balance" ? (
//                       <span className="text-red-500">Error</span>
//                     ) : (
//                       user.balance
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {loadingBalances && (
//             <p className="text-gray-500 mt-4">
//               Processing balances: auto-transfer & auto-withdraw...
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }





// "use client";

// import { useState } from "react";
// import axios from "axios";

// interface User {
//   userId: string;
//   address: string;
//   balance?: string | number;
// }

// export default function Home() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loadingBalances, setLoadingBalances] = useState(false);
//   const [error, setError] = useState("");
//   const [inputText, setInputText] = useState("");
//   const BASE_ADDRESS = "0x5fbcf1a5d3eade2cece981af9a0c528de38af7de";

//   async function handleSubmit() {
//     setError("");

//     const userIds = inputText
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line !== "");

//     if (userIds.length === 0) {
//       setError("Please enter at least one user ID.");
//       return;
//     }

//     // Build users list manually
//     let fetchedUsers: User[] = userIds.map((userId, index) => ({
//       userId,
//       address: "0x1234567890abcdef", // Placeholder address
//       balance: "Loading...",
//     }));

//     // Move "00001" to the end if it exists
//     fetchedUsers = fetchedUsers.sort((a, b) =>
//       a.userId === "00001" ? 1 : -1
//     );

//     setUsers(fetchedUsers);

//     // Process balances and transfers
//     fetchBalancesAndProcess(fetchedUsers);
//   }

//   async function fetchBalancesAndProcess(usersList: User[]) {
//     setLoadingBalances(true);

//     for (let i = 0; i < usersList.length; i++) {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay per user

//       try {
//         const balanceRes = await axios.post("/api/get-balance", {
//           userId: usersList[i].userId,
//           coinId: 1280,
//         });

//         const balance = parseFloat(
//           balanceRes.data?.data?.asset?.available || "0"
//         );

//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.userId === usersList[i].userId ? { ...user, balance } : user
//           )
//         );

//         // Withdraw if user is "00001" and balance > 10
//         if (usersList[i].userId === "00001" && balance > 10) {
//           console.log(
//             `Withdrawing ${balance} USDT from "00001" to external wallet...`
//           );

//           await axios.post("/api/auto-withdraw", {
//             userId: "00001",
//             coinId: 1280,
//             address: BASE_ADDRESS,
//             // address: "0x9e2d205ea1b27374114cb930669db868aaaa0260",
//             chain: "BSC",
//           });

//           console.log(`Withdrawal successful for "00001"`);
//         }

//         // Transfer from other users to "00001"
//         if (usersList[i].userId !== "00001" && balance > 0) {
//           console.log(
//             `Transferring ${balance} USDT from ${usersList[i].userId} to "00001"...`
//           );

//           await axios.post("/api/auto-transfer", {
//             fromUserId: usersList[i].userId,
//             toUserId: "00001",
//             coinId: 1280,
//           });

//           console.log(
//             `Transfer successful from ${usersList[i].userId} to "00001"`
//           );
//         }
//       } catch (err) {
//         console.error(
//           `Error fetching balance for ${usersList[i].userId}:`,
//           err
//         );
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.userId === usersList[i].userId
//               ? { ...user, balance: "Error fetching balance" }
//               : user
//           )
//         );
//       }
//     }

//     setLoadingBalances(false);
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
//       <h1 className="text-4xl font-bold mb-6 text-[#333333]">
//         User Balances & Auto-Processing
//         {BASE_ADDRESS}
//       </h1>

//       <textarea
//         className="w-full max-w-lg border border-gray-300 rounded-md p-2 mb-4"
//         rows={6}
//         placeholder="Enter user IDs (one per line)"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//       />

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         disabled={loadingBalances}
//       >
//         Submit
//       </button>

//       {error && <p className="text-red-500 mt-4">{error}</p>}

//       {users.length > 0 && (
//         <div className="overflow-x-auto mt-8">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-300 px-4 py-2">User ID</th>
//                 <th className="border border-gray-300 px-4 py-2">Address</th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   Balance (USDT)
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr
//                   key={user.userId}
//                   className={`hover:bg-gray-100 ${
//                     user.userId === "00001" ? "bg-yellow-100 font-bold" : ""
//                   }`}
//                 >
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.userId}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.address}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {user.balance === "Loading..." ? (
//                       <span className="text-blue-500 animate-pulse">
//                         Loading...
//                       </span>
//                     ) : user.balance === "Error fetching balance" ? (
//                       <span className="text-red-500">Error</span>
//                     ) : (
//                       user.balance
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {loadingBalances && (
//             <p className="text-gray-500 mt-4">
//               Processing balances: auto-transfer & auto-withdraw...
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  userId: string;
  address: string;
  balance?: string | number;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");
  //BINANCE
  const BASE_ADDRESS = "0x5fbcf1a5d3eade2cece981af9a0c528de38af7de";

  //BING_X
  // const BASE_ADDRESS = "0xeacb1948906d996acb61a2d2ff71860605539f40";

  useEffect(() => {
    const interval = setInterval(() => {
      if (inputText.trim() !== "") {
        handleSubmit();
      }
    }, 60_000); // 5 mins  seconds

    return () => clearInterval(interval); // Clean up when unmounted
  }, [inputText]);

  async function handleSubmit() {
    setError("");

    const userIds = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    if (userIds.length === 0) {
      setError("Please enter at least one user ID.");
      return;
    }

    let fetchedUsers: User[] = userIds.map((userId) => ({
      userId,
      address: "0x1234567890abcdef", // Placeholder address
      balance: "Loading...",
    }));

    fetchedUsers = fetchedUsers.sort((a, b) =>
      a.userId === "00001" ? 1 : -1
    );

    setUsers(fetchedUsers);

    fetchBalancesAndProcess(fetchedUsers);
  }

  async function fetchBalancesAndProcess(usersList: User[]) {
    setLoadingBalances(true);

    for (let i = 0; i < usersList.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay

      try {
        const balanceRes = await axios.post("/api/get-balance", {
          userId: usersList[i].userId,
          coinId: 1280,
        });

        const balance = parseFloat(
          balanceRes.data?.data?.asset?.available || "0"
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === usersList[i].userId ? { ...user, balance } : user
          )
        );

        if (usersList[i].userId === "00001" && balance > 10) {
          console.log(
            `Withdrawing ${balance} USDT from "00001" to external wallet...`
          );

          await axios.post("/api/auto-withdraw", {
            userId: "00001",
            coinId: 1280,
            address: BASE_ADDRESS,
            chain: "BSC",
          });

          console.log(`Withdrawal successful for "00001"`);
        }

        if (usersList[i].userId !== "00001" && balance > 0) {
          console.log(
            `Transferring ${balance} USDT from ${usersList[i].userId} to "00001"...`
          );

          await axios.post("/api/auto-transfer", {
            fromUserId: usersList[i].userId,
            toUserId: "00001",
            coinId: 1280,
          });

          console.log(
            `Transfer successful from ${usersList[i].userId} to "00001"`
          );
        }
      } catch (err) {
        console.error(
          `Error fetching balance for ${usersList[i].userId}:`,
          err
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userId === usersList[i].userId
              ? { ...user, balance: "Error fetching balance" }
              : user
          )
        );
      }
    }

    setLoadingBalances(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-[#333333]">
        User Balances & Auto-Processing
        {BASE_ADDRESS}
      </h1>

      <textarea
        className="w-full max-w-lg border border-gray-300 rounded-md p-2 mb-4"
        rows={6}
        placeholder="Enter user IDs (one per line)"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loadingBalances}
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {users.length > 0 && (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">User ID</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">
                  Balance (USDT)
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className={`hover:bg-gray-100 ${
                    user.userId === "00001" ? "bg-yellow-100 font-bold" : ""
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {user.userId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.balance === "Loading..." ? (
                      <span className="text-blue-500 animate-pulse">
                        Loading...
                      </span>
                    ) : user.balance === "Error fetching balance" ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      user.balance
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loadingBalances && (
            <p className="text-gray-500 mt-4">
              Processing balances: auto-transfer & auto-withdraw...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
