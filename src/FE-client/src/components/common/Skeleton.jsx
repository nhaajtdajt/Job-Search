import { useState, useEffect, useCallback, memo } from 'react';

/**
 * TableSkeleton Component
 * Skeleton loading placeholder for data tables
 */
export const TableSkeleton = memo(function TableSkeleton({ 
  rows = 5, 
  columns = 5 
}) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="flex gap-4 px-6 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div 
              key={i} 
              className="h-4 bg-gray-200 rounded flex-1"
              style={{ maxWidth: i === 0 ? '200px' : '100px' }}
            />
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 px-6 py-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div 
                key={colIdx} 
                className="h-4 bg-gray-200 rounded flex-1"
                style={{ 
                  maxWidth: colIdx === 0 ? '200px' : '100px',
                  opacity: 1 - (rowIdx * 0.1)
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * CardSkeleton Component
 * Skeleton loading placeholder for stat cards
 */
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
});

/**
 * ChartSkeleton Component
 * Skeleton loading placeholder for charts
 */
export const ChartSkeleton = memo(function ChartSkeleton({ height = 300 }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse"
      style={{ height }}
    >
      <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <div 
            key={i}
            className="bg-gray-200 rounded-t flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
});

/**
 * FormSkeleton Component
 * Skeleton loading placeholder for forms
 */
export const FormSkeleton = memo(function FormSkeleton({ fields = 4 }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <div className="h-10 bg-gray-200 rounded w-32" />
        <div className="h-10 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
});

/**
 * ProfileSkeleton Component
 * Skeleton loading placeholder for profile pages
 */
export const ProfileSkeleton = memo(function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-40" />
          </div>
        </div>
      </div>
      
      {/* Info sections */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-5 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * ListSkeleton Component
 * Skeleton for list items
 */
export const ListSkeleton = memo(function ListSkeleton({ items = 5 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
          style={{ opacity: 1 - (i * 0.1) }}
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
});

// Default export all skeletons
export default {
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  ListSkeleton
};
