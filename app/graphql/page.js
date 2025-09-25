"use client";

import { useQuery } from "@apollo/client/react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { GET_COUNTRIES } from "../../lib/apollo";
import styles from "../../styles/GraphQLPage.module.css";

export default function GraphQLPage() {
  const { currentMode } = useSelector((state) => state.mode);
  const shouldUseGraphQL = currentMode === "preview" || currentMode === "draft";

  const { loading, error, data } = useQuery(GET_COUNTRIES, {
    skip: !shouldUseGraphQL,
    fetchPolicy: "cache-and-network",
  });

  if (!shouldUseGraphQL) {
    return (
      <div className={styles.container}>
        <div className={styles.modeMessage}>
          <h2>REST Mode Active</h2>
          <p>
            Switch to preview or draft mode to view GraphQL data, or visit the
            REST section.
          </p>
          <Link href="/rest" className="btn btn-primary">
            Go to REST Section
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading GraphQL data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading GraphQL Data</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const countries = data?.countries || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>GraphQL API Data</h2>
        <p>Exploring Countries API with nested routing</p>
        <div className={styles.stats}>
          <span>Total Countries: {countries.length}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Countries</h3>
        <div className={styles.grid}>
          {countries.slice(0, 20).map((country) => (
            <div key={country.code} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.emoji}>{country.emoji}</span>
                <h4>{country.name}</h4>
                <p className={styles.code}>{country.code}</p>
              </div>

              <div className={styles.cardBody}>
                <p>
                  <strong>Continent:</strong> {country.continent.name}
                </p>
                <p>
                  <strong>Languages:</strong>{" "}
                  {country.languages.map((l) => l.name).join(", ")}
                </p>
              </div>

              <div className={styles.cardActions}>
                <Link
                  href={`/graphql/countries/${country.code}`}
                  className="btn btn-primary"
                >
                  Explore Country
                </Link>
              </div>
            </div>
          ))}
        </div>

        {countries.length > 20 && (
          <div className={styles.showMore}>
            <p>Showing 20 of {countries.length} countries</p>
          </div>
        )}
      </div>
    </div>
  );
}
