import { db } from "./db";
import { users, destinations, content, contactSubmissions, newsletterSubscriptions, packages, galleryImages } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";
import type { User, InsertUser, Destination, InsertDestination, Content, InsertContent, ContactSubmission, InsertContactSubmission, NewsletterSubscription, InsertNewsletterSubscription, Package, InsertPackage, GalleryImage, InsertGalleryImage } from "@shared/schema";

export class PostgresStorage implements IStorage {
  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    if (!db) return;
    
    try {
      // Check if admin user exists
      const existingAdmin = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
      
      if (existingAdmin.length === 0) {
        // Create admin user
        await db.insert(users).values({
          id: randomUUID(),
          username: "admin",
          password: "Ttrave",
          createdAt: new Date()
        });
        console.log("✅ Created admin user");
      }

      // Check if content exists
      const existingContent = await db.select().from(content).limit(1);
      
      if (existingContent.length === 0) {
        // Initialize default content
        const contentData = [
          { key: "site.name", value: "TTravel Hospitality" },
          { key: "hero.title", value: "Explore the World with TTRAVE" },
          { key: "hero.subtitle", value: "Book your next adventure with us!" },
          { key: "company.name", value: "TTravel Hospitality" },
          { key: "contact.phone", value: "+91 8100331032" },
          { key: "contact.email", value: "ttrave.travelagency@gmail.com" },
          { key: "contact.address", value: "B-12, Shop No. - 111/19, Saptaparni Market, Kalyani Central Park - ward no. 11, Nadia- 741235, West Bengal, India" },
          { key: "social.facebook", value: "#" },
          { key: "social.instagram", value: "#" },
          { key: "social.linkedin", value: "#" },
          { key: "social.twitter", value: "#" },
          { key: "inquiry.url", value: "https://forms.gle/your-inquiry-form-id" },
          { key: "inquiry.button.text", value: "Enquire Now" },
          { key: "about.hero.title", value: "About TTravel Hospitality" },
          { key: "about.hero.subtitle", value: "Your trusted partner for unforgettable travel experiences" },
          { key: "about.who.title", value: "Who We Are" },
          { key: "about.who.description1", value: "TTravel Hospitality is a premier travel agency dedicated to creating extraordinary travel experiences. With over a decade of expertise in the travel industry, we specialize in both domestic and international travel packages that cater to every traveler's dreams." },
          { key: "about.who.description2", value: "Our team of experienced travel consultants works tirelessly to ensure that every journey you take with us is seamless, memorable, and perfectly tailored to your preferences. From cultural expeditions to adventure tours, we have something special for everyone." },
          { key: "about.who.image", value: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop" },
          { key: "about.values.title", value: "Our Core Values" },
          { key: "about.mission.title", value: "Our Mission" },
          { key: "about.mission.description", value: "To provide exceptional travel experiences that create lasting memories and foster cultural understanding through personalized service and attention to detail." },
          { key: "about.vision.title", value: "Our Vision" },
          { key: "about.vision.description", value: "To be the leading travel agency that connects people with the world's most beautiful destinations while promoting sustainable and responsible tourism practices." },
          { key: "about.values.description.title", value: "Our Values" },
          { key: "about.values.description", value: "Integrity, Excellence, Customer Focus, Innovation, and Sustainability guide every decision we make and every service we provide to our valued customers." },
        ];

        for (const item of contentData) {
          await db.insert(content).values({
            id: randomUUID(),
            key: item.key,
            value: item.value,
            createdAt: new Date()
          });
        }
        console.log("✅ Initialized default content");
      }
    } catch (error) {
      console.error("❌ Error initializing default data:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    await db.insert(users).values(user);
    return user;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.update(users)
      .set({ password: newPassword })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    if (!db) return [];
    return await db.select().from(destinations).where(eq(destinations.isActive, true));
  }

  async getDestinationsByType(type: 'domestic' | 'international'): Promise<Destination[]> {
    if (!db) return [];
    return await db.select().from(destinations)
      .where(and(eq(destinations.type, type), eq(destinations.isActive, true)));
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
    return result[0];
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const destination = {
      ...insertDestination,
      id,
      icon: insertDestination.icon || "bi-geo-alt-fill",
      isActive: insertDestination.isActive ?? true,
      createdAt: new Date()
    };
    await db.insert(destinations).values(destination);
    return destination;
  }

  async updateDestination(id: string, updates: Partial<InsertDestination>): Promise<Destination | undefined> {
    if (!db) return undefined;
    const result = await db.update(destinations)
      .set(updates)
      .where(eq(destinations.id, id))
      .returning();
    return result[0];
  }

  async deleteDestination(id: string): Promise<boolean> {
    if (!db) return false;
    const result = await db.update(destinations)
      .set({ isActive: false })
      .where(eq(destinations.id, id))
      .returning();
    return result.length > 0;
  }

  // Content methods
  async getContent(): Promise<Content[]> {
    if (!db) return [];
    return await db.select().from(content);
  }

  async getContentByKey(key: string): Promise<Content | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(content).where(eq(content.key, key)).limit(1);
    return result[0];
  }

  async setContent(insertContent: InsertContent): Promise<Content> {
    if (!db) throw new Error("Database not available");
    
    const existing = await this.getContentByKey(insertContent.key);
    if (existing) {
      const result = await db.update(content)
        .set({ value: insertContent.value })
        .where(eq(content.key, insertContent.key))
        .returning();
      return result[0];
    }
    
    const id = randomUUID();
    const newContent = {
      ...insertContent,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.insert(content).values(newContent);
    return newContent;
  }

  async updateContent(key: string, value: string): Promise<Content | undefined> {
    if (!db) return undefined;
    const result = await db.update(content)
      .set({ value })
      .where(eq(content.key, key))
      .returning();
    return result[0];
  }

  // Contact submission methods
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    if (!db) return [];
    return await db.select().from(contactSubmissions);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const submission = {
      ...insertSubmission,
      id,
      status: insertSubmission.status || "new",
      createdAt: new Date()
    };
    await db.insert(contactSubmissions).values(submission);
    return submission;
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<ContactSubmission | undefined> {
    if (!db) return undefined;
    const result = await db.update(contactSubmissions)
      .set({ status })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return result[0];
  }

  // Newsletter subscription methods
  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    if (!db) return [];
    return await db.select().from(newsletterSubscriptions);
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    if (!db) throw new Error("Database not available");
    
    const existing = await db.select().from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, insertSubscription.email))
      .limit(1);
    
    if (existing.length > 0) {
      if (!existing[0].isActive) {
        const result = await db.update(newsletterSubscriptions)
          .set({ isActive: true })
          .where(eq(newsletterSubscriptions.email, insertSubscription.email))
          .returning();
        return result[0];
      }
      return existing[0];
    }

    const id = randomUUID();
    const subscription = {
      ...insertSubscription,
      id,
      isActive: true,
      createdAt: new Date()
    };
    await db.insert(newsletterSubscriptions).values(subscription);
    return subscription;
  }

  // Package methods
  async getPackages(): Promise<Package[]> {
    if (!db) return [];
    return await db.select().from(packages).where(eq(packages.isActive, true));
  }

  async getPackagesByDestination(destinationId: string): Promise<Package[]> {
    if (!db) return [];
    return await db.select().from(packages)
      .where(and(eq(packages.destinationId, destinationId), eq(packages.isActive, true)));
  }

  async getPackage(id: string): Promise<Package | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return result[0];
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const packageData = {
      ...insertPackage,
      id,
      isFeatured: insertPackage.isFeatured ?? false,
      isActive: insertPackage.isActive ?? true,
      createdAt: new Date()
    };
    await db.insert(packages).values(packageData);
    return packageData;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    if (!db) return undefined;
    const result = await db.update(packages)
      .set(updates)
      .where(eq(packages.id, id))
      .returning();
    return result[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    if (!db) return false;
    const result = await db.update(packages)
      .set({ isActive: false })
      .where(eq(packages.id, id))
      .returning();
    return result.length > 0;
  }

  // Gallery Image methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    if (!db) return [];
    return await db.select().from(galleryImages);
  }

  async getApprovedGalleryImages(): Promise<GalleryImage[]> {
    if (!db) return [];
    return await db.select().from(galleryImages).where(eq(galleryImages.isApproved, true));
  }

  async createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const galleryImage = {
      ...imageData,
      id,
      isApproved: false,
      createdAt: new Date()
    };
    await db.insert(galleryImages).values(galleryImage);
    return galleryImage;
  }

  async approveGalleryImage(id: string): Promise<GalleryImage | undefined> {
    if (!db) return undefined;
    const result = await db.update(galleryImages)
      .set({ isApproved: true })
      .where(eq(galleryImages.id, id))
      .returning();
    return result[0];
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    if (!db) return false;
    const result = await db.delete(galleryImages)
      .where(eq(galleryImages.id, id))
      .returning();
    return result.length > 0;
  }
}