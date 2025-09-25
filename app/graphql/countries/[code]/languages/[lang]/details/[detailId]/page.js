"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { GET_COUNTRY } from "../../../../../../../../lib/apollo";
import styles from "../../../../../../../../styles/DetailPage.module.css";

export default function DetailPage() {
  const params = useParams();
  const { currentMode } = useSelector((state) => state.mode);
  const shouldUseGraphQL = currentMode === "preview" || currentMode === "draft";

  const { loading, error, data } = useQuery(GET_COUNTRY, {
    variables: { code: params.code },
    skip: !shouldUseGraphQL,
    fetchPolicy: "cache-and-network",
  });

  if (!shouldUseGraphQL) {
    return (
      <div className={styles.container}>
        <div className={styles.modeMessage}>
          <h2>REST Mode Active</h2>
          <p>Switch to preview or draft mode to view GraphQL data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner">⟳</div>
          <p>Loading detail information...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.country) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Detail</h2>
          <p>{error?.message || "Data not found"}</p>
        </div>
      </div>
    );
  }

  const country = data.country;
  const currentLanguage = country.languages.find(
    (lang) => lang.code === params.lang
  );

  if (!currentLanguage) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Language Not Found</h2>
          <p>
            Language &quot;{params.lang}&quot; is not spoken in {country.name}
          </p>
        </div>
      </div>
    );
  }

  // Mock detailed content based on detailId
  const getDetailContent = (detailId) => {
    const detailTypes = {
      1: {
        title: `${currentLanguage.name} Grammar Rules`,
        type: "Grammar",
        content: `
          The ${currentLanguage.name} language follows specific grammatical structures that are unique to its linguistic family. 
          Grammar rules include sentence structure, verb conjugation patterns, and noun declension systems.
          
          Key grammatical features:
          • Word order patterns
          • Tense and aspect systems
          • Pronoun usage
          • Article placement
          • Adjective agreement
          
          Understanding these rules is essential for proper communication in ${currentLanguage.name}.
        `,
      },
      2: {
        title: `Common ${currentLanguage.name} Phrases`,
        type: "Phrases",
        content: `
          Essential phrases in ${currentLanguage.name} for everyday communication:
          
          Basic Greetings:
          • Hello / Good day
          • Good morning / Good evening
          • How are you?
          • Nice to meet you
          
          Common Expressions:
          • Please / Thank you
          • Excuse me / Sorry
          • Yes / No
          • I don't understand
          
          Travel Phrases:
          • Where is...?
          • How much does it cost?
          • Can you help me?
          • Do you speak English?
        `,
      },
      3: {
        title: `${currentLanguage.name} Writing System`,
        type: "Writing System",
        content: `
          The writing system used for ${currentLanguage.name} has evolved over centuries and reflects the language's rich history.
          
          Writing System Features:
          • Script type and direction
          • Character encoding standards
          • Punctuation conventions
          • Capitalization rules
          
          Historical Development:
          • Origins and influences
          • Modern standardization
          • Digital representation
          • Typography considerations
          
          The writing system is an integral part of ${currentLanguage.name} literacy and cultural expression.
        `,
      },
      4: {
        title: `${currentLanguage.name} History`,
        type: "Historical Context",
        content: `
          The ${currentLanguage.name} language has a rich historical background that spans many centuries.
          
          Historical Timeline:
          • Ancient origins and early development
          • Medieval period influences
          • Modern standardization efforts
          • Contemporary usage patterns
          
          Cultural Significance:
          • Literature and poetry traditions
          • Religious and ceremonial use
          • Educational importance
          • Media and communication
          
          Geographic Distribution:
          • Primary speaking regions
          • Diaspora communities
          • Official status in various countries
          • Regional dialects and variations
        `,
      },
    };

    return (
      detailTypes[detailId] || {
        title: "Unknown Detail",
        type: "Information",
        content: "Detail information not available.",
      }
    );
  };

  const detail = getDetailContent(params.detailId);

  return (
    <div className={styles.container}>
      {/* Breadcrumb Context */}
      <div className={styles.contextSection}>
        <div className={styles.contextCard}>
          <span className={styles.emoji}>{country.emoji}</span>
          <div>
            <h4>{country.name}</h4>
            <p>Country</p>
          </div>
        </div>
        <div className={styles.contextCard}>
          <div className={styles.languageIcon}>🗣️</div>
          <div>
            <h4>{currentLanguage.name}</h4>
            <p>Language ({currentLanguage.code})</p>
          </div>
        </div>
      </div>

      {/* Main Detail Content */}
      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <h1>{detail.title}</h1>
          <span className={styles.detailType}>{detail.type}</span>
        </div>

        <div className={styles.detailContent}>
          {detail.content.split("\n").map(
            (paragraph, index) =>
              paragraph.trim() && (
                <p key={index} className={styles.paragraph}>
                  {paragraph.trim()}
                </p>
              )
          )}
        </div>

        <div className={styles.detailMeta}>
          <div className={styles.metaItem}>
            <strong>Detail ID:</strong> {params.detailId}
          </div>
          <div className={styles.metaItem}>
            <strong>Language:</strong> {currentLanguage.name} (
            {currentLanguage.code})
          </div>
          <div className={styles.metaItem}>
            <strong>Country:</strong> {country.name} ({country.code})
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigationSection}>
        <div className={styles.navigationLinks}>
          <Link
            href={`/graphql/countries/${params.code}/languages/${params.lang}`}
            className="btn btn-secondary"
          >
            ← Back to Language
          </Link>
          <Link
            href={`/graphql/countries/${params.code}`}
            className="btn btn-secondary"
          >
            View Country
          </Link>
          <Link href="/graphql" className="btn btn-primary">
            GraphQL Home
          </Link>
        </div>
      </div>

      {/* Navigation Trail Summary */}
      <div className={styles.trailSummary}>
        <h3>Navigation Trail (4 Levels Deep)</h3>
        <div className={styles.trailItems}>
          <div className={styles.trailItem}>
            <strong>Level 1:</strong> GraphQL API Home
          </div>
          <div className={styles.trailItem}>
            <strong>Level 2:</strong> Country {params.code} ({country.name})
          </div>
          <div className={styles.trailItem}>
            <strong>Level 3:</strong> Language {params.lang} (
            {currentLanguage.name})
          </div>
          <div className={styles.trailItem}>
            <strong>Level 4:</strong> Detail {params.detailId} ({detail.type})
          </div>
        </div>
      </div>
    </div>
  );
}
