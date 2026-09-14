import React, { useEffect, useState } from 'react'
import {
    ShoppingCart,
    Package,
    Tags,
    DollarSign,
    TrendingUp,
    Users,
    ArrowUpRight,
    Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'
import { getOrdersAdmin, getListAllUsers } from '../../api/admin'
import { listProduct } from '../../api/product'
import { listCategory } from '../../api/Category'
import { numberFormat } from '../../utils/number'
import { dateFormat } from '../../utils/dateformat'

const DashboardAdmin = () => {
    const token = useEcomStore((state) => state.token)

    // States สำหรับเก็บข้อมูลที่โหลดจาก Database
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            loadDashboardData()
        }
    }, [token])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [resOrders, resProducts, resCategories, resUsers] = await Promise.all([
                getOrdersAdmin(token),
                listProduct(100),
                listCategory(),
                getListAllUsers(token)
            ])

            setOrders(resOrders.data || [])
            setProducts(resProducts.data || [])
            setCategories(resCategories.data || [])
            setUsers(resUsers.data || [])
        } catch (err) {
            console.error("Error loading dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }

    // --- คำนวณค่าจริงจาก DB ---
    // 1. Total Sales (รวมยอดขายเฉพาะคำสั่งซื้อที่สถานะเป็น Completed)
    const totalSales = orders
        .filter((order) => order.orderStatus === 'Completed')
        .reduce((sum, order) => sum + (order.cartTotal || 0), 0)

    // 2. Pending Orders
    const pendingOrdersCount = orders.filter(
        (order) => order.orderStatus === 'Not Process' || order.orderStatus === 'Processing'
    ).length

    // 3. Best Selling Products (เรียงจาก sold สูงสุด 4 อันดับแรก)
    const bestProducts = [...products]
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 4)

    // 4. Recent Orders (4 รายการล่าสุด)
    const recentOrders = orders.slice(0, 4)

    const stats = [
        {
            title: 'Total Sales',
            value: numberFormat(totalSales),
            change: 'Completed',
            icon: DollarSign
        },
        {
            title: 'Total Orders',
            value: orders.length,
            change: `Pending: ${pendingOrdersCount}`,
            icon: ShoppingCart
        },
        {
            title: 'Total Products',
            value: products.length,
            change: 'In Store',
            icon: Package
        },
        {
            title: 'Categories',
            value: categories.length,
            change: 'Active',
            icon: Tags
        }
    ]

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-700'
            case 'Processing':
                return 'bg-blue-100 text-blue-700'
            case 'Not Process':
                return 'bg-yellow-100 text-yellow-700'
            case 'Cancelled':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading) {
        return <div className="p-6 text-center text-gray-500 font-medium">กำลังโหลดข้อมูล Dashboard...</div>
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, Admin 👋
                    </p>
                </div>

                <div className="text-sm text-gray-500">
                    Admin Panel / Dashboard
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {item.title}
                                    </p>
                                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                                        {item.value}
                                    </h2>
                                    <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                        <TrendingUp size={15} />
                                        {item.change}
                                    </div>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <Icon size={25} className="text-gray-700" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
                {/* Sales Overview / Order Visualizer */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Sales Overview
                            </h2>
                            <p className="text-sm text-gray-500">
                                Recent orders value distribution
                            </p>
                        </div>
                    </div>

                    {/* Chart/Bar Visualization based on actual order values */}
                    <div className="h-64 flex items-end gap-3 border-b border-gray-200 px-3 pb-2">
                        {orders.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                ยังไม่มีข้อมูลคำสั่งซื้อ
                            </div>
                        ) : (
                            orders.slice(0, 12).map((order, index) => {
                                const maxVal = Math.max(...orders.map((o) => o.cartTotal || 1), 1)
                                const heightPercent = Math.min(Math.round(((order.cartTotal || 0) / maxVal) * 100), 100)

                                return (
                                    <div
                                        key={index}
                                        className="flex-1 flex flex-col justify-end items-center gap-2 group relative"
                                    >
                                        <div className="absolute -top-8 hidden group-hover:block bg-gray-800 text-white text-xs p-1 rounded shadow z-10 whitespace-nowrap">
                                            {numberFormat(order.cartTotal)}
                                        </div>
                                        <div
                                            className="w-full bg-gray-800 rounded-t-md hover:bg-gray-600 transition"
                                            style={{ height: `${Math.max(heightPercent, 8)}%` }}
                                        />
                                        <span className="text-xs text-gray-400">
                                            #{order.id}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        Store Summary
                    </h2>
                    <p className="text-sm text-gray-500 mb-5">
                        Current store status
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Users size={20} />
                                <span>Customers</span>
                            </div>
                            <b>{users.length}</b>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Package size={20} />
                                <span>Products</span>
                            </div>
                            <b>{products.length}</b>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Tags size={20} />
                                <span>Categories</span>
                            </div>
                            <b>{categories.length}</b>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Clock size={20} />
                                <span>Pending Orders</span>
                            </div>
                            <b>{pendingOrdersCount}</b>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Recent Orders
                            </h2>
                            <p className="text-sm text-gray-500">
                                Latest customer orders
                            </p>
                        </div>

                        <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-gray-700 hover:underline">
                            View All
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-gray-500">
                                    <th className="pb-3">Order</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Price</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b last:border-0">
                                        <td className="py-4 font-medium">
                                            #{order.id}
                                        </td>
                                        <td className="py-4">
                                            {order.orderedBy?.email || 'N/A'}
                                        </td>
                                        <td className="py-4 font-medium">
                                            {numberFormat(order.cartTotal)}
                                        </td>
                                        <td className="py-4 text-xs text-gray-500">
                                            {dateFormat(order.createdAt)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Best Selling Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Best Selling Products
                            </h2>
                            <p className="text-sm text-gray-500">
                                Top products in store
                            </p>
                        </div>

                        <Link to="/admin/product" className="text-sm text-gray-700 hover:underline">
                            View Products
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {bestProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between border-b last:border-0 pb-4"
                            >
                                <div className="flex items-center gap-3">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.title}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package size={20} />
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Sold {product.sold || 0} items
                                        </p>
                                    </div>
                                </div>

                                <span className="font-semibold">
                                    {numberFormat(product.price)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin