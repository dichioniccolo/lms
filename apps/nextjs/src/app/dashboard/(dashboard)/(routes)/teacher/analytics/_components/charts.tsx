"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@acme/ui/components/ui/card";

interface Props {
  data: {
    id: string;
    title: string;
    earnings: number;
  }[];
}

export function Charts({ data }: Props) {
  return (
    <Card>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-full min-h-64 items-center justify-center">
            <span>No data to show</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="title"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar dataKey="earnings" fill="#0369a1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
